// app/api/chat/route.js
//
// ══════════════════════════════════════════════════════════════════════════════
// PROVIDER CONFIGURATION
// ══════════════════════════════════════════════════════════════════════════════
//
// Three providers are implemented. One is active at a time.
// The SSE output format and all client code are identical across providers.
// useChatStream, ChatMessages, ChatInput, EscalationCard — zero changes on swap.
//
// ┌─────────────┬──────────────────────────────┬────────────┬──────────────────┐
// │ Provider    │ Model                        │ Cost       │ Env var          │
// ├─────────────┼──────────────────────────────┼────────────┼──────────────────┤
// │ Groq ✓      │ llama-3.3-70b-versatile      │ Free       │ GROQ_API_KEY     │
// │ Gemini      │ gemini-1.5-flash             │ Free       │ GEMINI_API_KEY   │
// │ Anthropic   │ claude-sonnet-4-20250514     │ Paid       │ ANTHROPIC_API_KEY│
// └─────────────┴──────────────────────────────┴────────────┴──────────────────┘
//
// ── HOW TO GET GROQ API KEY (currently active) ────────────────────────────────
//   1. Go to console.groq.com
//   2. Sign up / sign in
//   3. API Keys → Create API Key
//   4. Add to .env.local: GROQ_API_KEY=gsk_...
//
// ── TO SWAP TO GEMINI ─────────────────────────────────────────────────────────
//   1. npm install @google/genai
//   2. Get key: aistudio.google.com → Get API key → Create API key in new project
//   3. Add to .env.local: GEMINI_API_KEY=AIza...
//   4. In this file: uncomment Gemini block, comment out Groq block
//      (imports at top + stream block in POST handler)
//
// ── TO SWAP TO ANTHROPIC (production) ─────────────────────────────────────────
//   1. npm install @anthropic-ai/sdk
//   2. Get key: console.anthropic.com → API Keys
//   3. Add to .env.local: ANTHROPIC_API_KEY=sk-ant-...
//   4. In this file: uncomment Anthropic block, comment out Groq block
//      (imports at top + stream block in POST handler)
//
// ══════════════════════════════════════════════════════════════════════════════

// ── ACTIVE: Gemini ────────────────────────────────────────────────
// import { GoogleGenAI } from "@google/genai";
// const geminiClient = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });
// // const GEMINI_MODEL = "gemini-1.5-flash";
// const GEMINI_MODEL = "gemini-2.0-flash";

// ── ACTIVE: Groq ──────────────────────────────────────────────────────────────
// npm install groq-sdk
import Groq from "groq-sdk";
const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GROQ_MODEL = "llama-3.3-70b-versatile";

// ── SWAP TARGET: Anthropic (uncomment to activate) ────────────────
// import Anthropic from "@anthropic-ai/sdk";
// const anthropicClient = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import {
  CHAT_MODEL,
  CHAT_CONFIG,
  SSE_HEADERS,
  sseChunk,
} from "@/lib/chat/constants";
import { AVAILABILITY } from "@/features/contact/contact-data";

// ─── Input validation ─────────────────────────────────────────────────────────

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "Messages must be a non-empty array.";
  }
  for (const msg of messages) {
    if (!["user", "assistant"].includes(msg.role)) {
      return "Invalid message role.";
    }
    if (typeof msg.content !== "string" || msg.content.trim().length === 0) {
      return "Message content must be a non-empty string.";
    }
    if (msg.content.length > CHAT_CONFIG.maxUserChars) {
      return `Message exceeds ${CHAT_CONFIG.maxUserChars} character limit.`;
    }
  }
  return null;
}

// ─── Message sanitisation ─────────────────────────────────────────────────────

function sanitiseMessages(messages) {
  const capped = messages.slice(-CHAT_CONFIG.maxMessages);
  const trimmed = [...capped];
  // Anthropic requires the last message to be from the user.
  // Gemini is lenient but we enforce it for provider parity.
  while (trimmed.length > 0 && trimmed[trimmed.length - 1].role !== "user") {
    trimmed.pop();
  }
  return trimmed.map((m) => ({
    role: m.role,
    content: String(m.content).trim(),
  }));
}

// ─── Gemini message format conversion ────────────────────────────────────────
//
// Gemini uses { role: "user"|"model", parts: [{ text }] }
// Anthropic uses { role: "user"|"assistant", content: string }
//
// We store messages internally using the Anthropic convention (role: "assistant")
// and convert to Gemini's "model" role here. The system prompt is passed
// separately via the `systemInstruction` field — not as a message.

function toGeminiHistory(messages) {
  const historyMessages = messages.slice(0, -1);
  const history = [];

  for (const m of historyMessages) {
    const role = m.role === "assistant" ? "model" : "user";

    // FIX 1: Gemini strictly requires alternating roles.
    // If we detect consecutive messages of the same role, combine their text.
    if (history.length > 0 && history[history.length - 1].role === role) {
      history[history.length - 1].parts[0].text += `\n\n${m.content}`;
    } else {
      history.push({ role, parts: [{ text: m.content }] });
    }
  }

  // FIX 2: History MUST end with a 'model' role because the upcoming message
  // passed to sendMessageStream() is implicitly a 'user' message.
  if (history.length > 0 && history[history.length - 1].role === "user") {
    history.pop();
  }

  return history;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request) {
  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  // Honeypot
  if (body._trap) {
    return new Response("", { status: 200 });
  }

  // Validate
  const validationError = validateMessages(body.messages);
  if (validationError) {
    return Response.json({ message: validationError }, { status: 422 });
  }

  // Sanitise
  const messages = sanitiseMessages(body.messages);
  if (messages.length === 0) {
    return Response.json(
      { message: "No valid messages to process." },
      { status: 422 },
    );
  }

  // System prompt — built from live availability data
  const systemPrompt = buildSystemPrompt({
    available: AVAILABILITY.open,
    startDate: AVAILABILITY.startDate,
    responseTime: AVAILABILITY.responseTime,
  });

  // ── Gemini stream ─────────────────────────────────────────────────────────
  // Comment this block out and uncomment the Anthropic block below to swap.

  // try {
  //   const lastMessage = messages[messages.length - 1].content;
  //   const history = toGeminiHistory(messages);

  //   // FIX 3: Build the config object dynamically.
  //   // Only include the `history` array if it actually has items.
  //   const chatConfig = {
  //     model: GEMINI_MODEL,
  //     config: {
  //       systemInstruction: systemPrompt,
  //       maxOutputTokens: CHAT_CONFIG.maxTokens,
  //       temperature: CHAT_CONFIG.temperature,
  //     },
  //   };

  //   if (history.length > 0) {
  //     chatConfig.history = history;
  //   }

  //   // Initialize the chat session with the safe config
  //   const chat = geminiClient.chats.create(chatConfig);

  //   // Start the stream
  //   const geminiStream = await chat.sendMessageStream({
  //     message: lastMessage,
  //   });

  //   const readable = new ReadableStream({
  //     async start(controller) {
  //       const encoder = new TextEncoder();
  //       try {
  //         for await (const chunk of geminiStream) {
  //           // FIX 4: Safely access the text. If the chunk is a safety block,
  //           // chunk.text throws an error in the v2 SDK.
  //           let text = "";
  //           try {
  //             text = chunk.text;
  //           } catch (e) {
  //             console.warn("[chat route] Safe-blocked or empty chunk ignored.");
  //           }

  //           if (text) {
  //             controller.enqueue(sseChunk(encoder, { text }));
  //           }
  //         }
  //         controller.enqueue(sseChunk(encoder, { done: true }));
  //       } catch (streamErr) {
  //         console.error("[chat route] Gemini stream error:", streamErr);
  //         controller.enqueue(
  //           sseChunk(encoder, { error: "Stream interrupted." }),
  //         );
  //       } finally {
  //         controller.close();
  //       }
  //     },
  //   });

  //   return new Response(readable, {
  //     headers: {
  //       "Content-Type": "text/event-stream",
  //       "Cache-Control": "no-cache, no-transform",
  //       "X-Accel-Buffering": "no",
  //       Connection: "keep-alive",
  //     },
  //   });
  // } catch (err) {
  //   console.error("[chat route] Gemini error:", err);
  //   const status = err?.status ?? 500;
  //   const message =
  //     status === 429
  //       ? "Too many requests. Please wait a moment and try again."
  //       : "Something went wrong. Please try again or reach out directly.";
  //   return Response.json({ message }, { status });
  // }

  // ════════════════════════════════════════════════════════════════════════════
  // ── ACTIVE: Groq stream ──────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  //
  // Groq uses the OpenAI-compatible interface.
  // Messages are passed in the same { role, content } format as Anthropic —
  // no conversion needed. System prompt goes in the messages array as the
  // first entry with role: "system".

  try {
    const groqStream = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: CHAT_CONFIG.maxTokens,
      temperature: CHAT_CONFIG.temperature,
      stream: true,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of groqStream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(sseChunk(encoder, { text }));
            }
          }
          controller.enqueue(sseChunk(encoder, { done: true }));
        } catch (streamErr) {
          console.error("[chat route] Groq stream error:", streamErr);
          controller.enqueue(
            sseChunk(encoder, { error: "Stream interrupted." }),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, { headers: SSE_HEADERS });
  } catch (err) {
    console.error("[chat route] Groq error:", err);
    const status = err?.status ?? err?.statusCode ?? 500;
    const message =
      status === 429
        ? "Too many requests. Please wait a moment and try again."
        : status === 401
          ? "Invalid API key. Check GROQ_API_KEY in your environment."
          : "Something went wrong. Please try again or reach out directly.";
    return Response.json({ message }, { status });
  }

  // ══════════════════════════════════════════════════════════════════
  // ── ANTHROPIC STREAM (swap target — uncomment to activate) ───────
  // ══════════════════════════════════════════════════════════════════
  //
  // try {
  //   const anthropicStream = await anthropicClient.messages.stream({
  //     model: CHAT_MODEL,                    // "claude-sonnet-4-20250514"
  //     max_tokens: CHAT_CONFIG.maxTokens,
  //     system: systemPrompt,
  //     messages,                             // Already in Anthropic format
  //   });
  //
  //   const readable = new ReadableStream({
  //     async start(controller) {
  //       const encoder = new TextEncoder();
  //       try {
  //         for await (const chunk of anthropicStream) {
  //           if (
  //             chunk.type === "content_block_delta" &&
  //             chunk.delta?.type === "text_delta"
  //           ) {
  //             controller.enqueue(sseChunk(encoder, { text: chunk.delta.text }));
  //           }
  //         }
  //         controller.enqueue(sseChunk(encoder, { done: true }));
  //       } catch (streamErr) {
  //         console.error("[chat route] Anthropic stream error:", streamErr);
  //         controller.enqueue(sseChunk(encoder, { error: "Stream interrupted." }));
  //       } finally {
  //         controller.close();
  //       }
  //     },
  //   });
  //
  //   return new Response(readable, {
  //     headers: {
  //       "Content-Type": "text/event-stream",
  //       "Cache-Control": "no-cache, no-transform",
  //       "X-Accel-Buffering": "no",
  //       Connection: "keep-alive",
  //     },
  //   });
  // } catch (err) {
  //   console.error("[chat route] Anthropic error:", err);
  //   const status = err?.status ?? 500;
  //   const message =
  //     status === 429
  //       ? "Too many requests. Please wait a moment and try again."
  //       : status === 401
  //         ? "Authentication error. Please contact Alex directly."
  //         : "Something went wrong. Please try again or reach out directly.";
  //   return Response.json({ message }, { status });
  // }
}
