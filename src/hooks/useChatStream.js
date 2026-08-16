// hooks/useChatStream.js

"use client";
//
// Core chat state and streaming logic.
//
// Responsibilities:
//   - Manage messages array (user + assistant turns)
//   - Stream assistant responses chunk by chunk
//   - Parse escalation signal from completed responses
//   - Handle abort (user closes widget mid-stream)
//   - Expose loading, error, and escalation state to the widget
//
// The hook owns NO UI. It is a pure state machine.

import { useState, useCallback, useRef } from "react";
import { parseEscalation, CHAT_CONFIG } from "@/lib/chat/constants";

// ─── Message factory ──────────────────────────────────────────────────────────

let _id = 0;
const uid = () => `msg_${++_id}_${Date.now()}`;

function userMessage(content) {
  return { id: uid(), role: "user", content };
}

function assistantMessage(content = "") {
  return { id: uid(), role: "assistant", content };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChatStream() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [escalation, setEscalation] = useState(null); // { reason, channel }

  // Ref tracks whether the stream has already produced an escalation signal
  // in this session — the AI is instructed to escalate only once, but the
  // client enforces this too.
  const hasEscalated = useRef(false);

  // AbortController ref — cancelled when widget unmounts or user aborts
  const abortRef = useRef(null);

  // ── Send ──────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (content) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;
      if (trimmed.length > CHAT_CONFIG.maxUserChars) return;

      setError(null);

      // Append user message immediately — optimistic UI
      const userMsg = userMessage(trimmed);
      setMessages((prev) => [...prev, userMsg]);

      // Placeholder assistant message — content fills in as stream arrives
      const assistantMsg = assistantMessage();
      setMessages((prev) => [...prev, assistantMsg]);
      setIsStreaming(true);

      // Build history for API — all messages including the new user one.
      // The assistant placeholder is excluded (empty content invalid).
      const history = (
        await new Promise((res) =>
          setMessages((prev) => {
            res(prev);
            return prev;
          }),
        )
      )
        .filter((m) => m.id !== assistantMsg.id && m.content.trim() !== "")
        .map(({ role, content }) => ({ role, content }));

      // Abort controller — cleans up on widget close or component unmount
      const controller = new AbortController();
      abortRef.current = controller;

      // Accumulator — full response text built chunk by chunk
      let accumulated = "";

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, _trap: "" }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message ?? "Request failed.");
        }

        // ── Read SSE stream ─────────────────────────────────────────────────
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by "\n\n"
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? ""; // Retain incomplete event in buffer

          for (const event of events) {
            const line = event.trim();
            if (!line.startsWith("data: ")) continue;

            let payload;
            try {
              payload = JSON.parse(line.slice(6)); // Strip "data: "
            } catch {
              continue;
            }

            if (payload.error) {
              throw new Error(payload.error);
            }

            if (payload.done) break;

            if (typeof payload.text === "string") {
              accumulated += payload.text;

              // Update assistant message content live — streaming cursor
              // effect comes from the content building character by character
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsg.id ? { ...m, content: accumulated } : m,
                ),
              );
            }
          }
        }

        // ── Parse escalation from completed response ─────────────────────────
        const { clean, escalation: signal } = parseEscalation(accumulated);

        // Update final content — escalation signal stripped
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: clean } : m,
          ),
        );

        if (signal && !hasEscalated.current) {
          hasEscalated.current = true;
          setEscalation(signal);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          // User aborted — clean up the empty assistant placeholder
          setMessages((prev) =>
            prev.filter(
              (m) => !(m.id === assistantMsg.id && m.content.trim() === ""),
            ),
          );
          return;
        }

        setError(err.message ?? "Something went wrong. Please try again.");

        // Remove empty placeholder on error
        setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming],
  );

  // ── Abort ─────────────────────────────────────────────────────────────────
  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // ── Clear ─────────────────────────────────────────────────────────────────
  const clearConversation = useCallback(() => {
    abort();
    setMessages([]);
    setError(null);
    setEscalation(null);
    hasEscalated.current = false;
  }, [abort]);

  // ── Dismiss escalation ────────────────────────────────────────────────────
  const dismissEscalation = useCallback(() => {
    setEscalation(null);
  }, []);

  return {
    messages,
    isStreaming,
    error,
    escalation,
    sendMessage,
    abort,
    clearConversation,
    dismissEscalation,
  };
}
