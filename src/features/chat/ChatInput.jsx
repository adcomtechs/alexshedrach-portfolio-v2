// features/chat/ChatInput.jsx
"use client";
//
// Chat input bar.
// - Send on Enter (Shift+Enter = newline)
// - Character count approaching limit
// - Stop button replaces send during streaming
// - Disabled when at char limit

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CHAT_CONFIG } from "@/lib/chat/constants";

// ─── Send icon ────────────────────────────────────────────────────────────────
function SendIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

// ─── Stop icon ────────────────────────────────────────────────────────────────
function StopIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
    </svg>
  );
}

// ─── ChatInput ────────────────────────────────────────────────────────────────

export function ChatInput({ onSend, onAbort, isStreaming, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const charCount = value.length;
  const atLimit = charCount >= CHAT_CONFIG.maxUserChars;
  const nearLimit = charCount >= CHAT_CONFIG.maxUserChars * 0.85;
  const canSend = value.trim().length > 0 && !atLimit && !isStreaming;

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(value);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [canSend, onSend, value]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // Auto-grow textarea up to 5 lines
  const handleInput = useCallback((e) => {
    setValue(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    const lineHeight = 22;
    const maxHeight = lineHeight * 5;
    ta.style.height = `${Math.min(ta.scrollHeight, maxHeight)}px`;
  }, []);

  return (
    <div
      className="flex flex-col gap-1.5 p-3 border-t"
      style={{ borderColor: "var(--color-border-sub)" }}
    >
      {/* Input row */}
      <div
        className="flex items-end gap-2 rounded-xl px-3 py-2"
        style={{
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          transition: "border-color 150ms ease",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask about products, pricing, availability…"
          rows={1}
          maxLength={CHAT_CONFIG.maxUserChars}
          disabled={disabled}
          aria-label="Chat message"
          className={cn(
            "flex-1 resize-none bg-transparent outline-none",
            "placeholder:text-[var(--color-faint)]",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-fg)",
            lineHeight: "22px",
            minHeight: "22px",
            maxHeight: "110px",
            fontFamily: "inherit",
          }}
        />

        {/* Action button — Send or Stop */}
        {isStreaming ? (
          <button
            onClick={onAbort}
            className={cn(
              "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
              "transition-[background,transform] duration-150",
              "hover:scale-105 active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--color-danger)] focus-visible:ring-offset-2",
              "focus-visible:ring-offset-[var(--color-bg)]",
            )}
            style={{
              background: "var(--color-danger-bg)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "var(--color-danger)",
            }}
            aria-label="Stop generating"
          >
            <StopIcon />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
              "transition-[background,transform,opacity] duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
              "focus-visible:ring-offset-[var(--color-bg)]",
              canSend
                ? "hover:scale-105 active:scale-95"
                : "opacity-40 cursor-not-allowed",
            )}
            style={{
              background: canSend
                ? "var(--color-accent)"
                : "var(--color-surface)",
              border: canSend ? "none" : "1px solid var(--color-border)",
              color: canSend
                ? "var(--color-accent-contrast)"
                : "var(--color-faint)",
            }}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        )}
      </div>

      {/* Footer row — char count + hint */}
      <div className="flex items-center justify-between px-1">
        <p
          style={{
            fontSize: "10px",
            color: "var(--color-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Enter to send · Shift+Enter for newline
        </p>
        {nearLimit && (
          <span
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
              color: atLimit ? "var(--color-danger)" : "var(--color-warning)",
              transition: "color 150ms",
            }}
            aria-live="polite"
          >
            {charCount}/{CHAT_CONFIG.maxUserChars}
          </span>
        )}
      </div>
    </div>
  );
}
