// lib/chat/constants.js
//
// Single source of truth for all chat configuration.
// Route handler and client both import from here — one change point.

export const CHAT_MODEL = "claude-sonnet-4-20250514";

// ─── SSE helper ───────────────────────────────────────────────────────────────
 
export function sseChunk(encoder, payload) {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}

// ─── Shared SSE response headers ──────────────────────────────────────────────
 
export const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no",
  Connection: "keep-alive",
};
 

export const CHAT_CONFIG = {
  maxTokens: 1024,
  maxMessages: 20, // Hard cap on conversation history sent to API
  maxUserChars: 1000, // Max characters per user message
  temperature: 0.7,
};

// Suggested prompts shown in the empty state.
// Keep to 4 — more than this clutters the widget.
export const SUGGESTED_PROMPTS = [
  "What products does Alex offer for institutions?",
  "How does licensing AttendIQ work?",
  "What does a custom build project look like?",
  "Is Alex available to start a new project?",
];

// Escalation signal protocol — must match system-prompt.js exactly.
export const ESCALATION_SIGNAL_RE = /%%ESCALATE%%(\{.*?\})%%END%%/s;

/**
 * parseEscalation
 *
 * Strips the escalation signal from a completed stream chunk and returns
 * the parsed payload and clean text separately.
 *
 * @param {string} text — raw accumulated stream text
 * @returns {{ clean: string, escalation: object | null }}
 */
export function parseEscalation(text) {
  const match = text.match(ESCALATION_SIGNAL_RE);
  if (!match) return { clean: text, escalation: null };

  let escalation = null;
  try {
    escalation = JSON.parse(match[1]);
  } catch {
    // Malformed JSON in signal — treat as no escalation
  }

  const clean = text.replace(ESCALATION_SIGNAL_RE, "").trimEnd();
  return { clean, escalation };
}

// Escalation reason → human-readable label for the EscalationCard
export const ESCALATION_REASON_LABEL = {
  pricing: "discussing pricing",
  timeline: "scoping a timeline",
  proposal: "a project proposal",
  direct: "a direct conversation",
  licensing: "product licensing",
};
