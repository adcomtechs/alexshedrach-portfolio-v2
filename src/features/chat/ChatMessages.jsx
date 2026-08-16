// features/chat/ChatMessages.jsx
"use client";
//
// Renders the scrollable message list.
// Auto-scrolls to the latest message as the stream arrives.
// Shows the empty state (suggested prompts) when no messages exist.

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SUGGESTED_PROMPTS } from "@/lib/chat/constants";

// ─── Streaming cursor ─────────────────────────────────────────────────────────
function StreamingCursor() {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-[2px] h-[14px] ml-0.5 align-middle rounded-full animate-pulse-soft"
      style={{ background: "var(--color-accent)", verticalAlign: "middle" }}
    />
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ role }) {
  const isAssistant = role === "assistant";
  return (
    <div
      className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
      style={{
        background: isAssistant
          ? "var(--color-accent-bg)"
          : "var(--color-surface-2)",
        border: isAssistant
          ? "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)"
          : "1px solid var(--color-border)",
        color: isAssistant ? "var(--color-accent)" : "var(--color-muted)",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.05em",
      }}
      aria-hidden="true"
    >
      {isAssistant ? "AI" : "You"}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message, isStreaming, isLast }) {
  const isUser = message.role === "user";
  const isStreamingThis = isStreaming && isLast && !isUser;
  const isEmpty = message.content.trim() === "";

  return (
    <div
      className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}
    >
      <Avatar role={message.role} />

      <div
        className={cn(
          "relative max-w-[85%] px-3.5 py-2.5 rounded-2xl",
          isUser ? "rounded-tr-sm" : "rounded-tl-sm",
        )}
        style={{
          background: isUser ? "var(--color-accent)" : "var(--color-surface-2)",
          color: isUser ? "var(--color-accent-contrast)" : "var(--color-fg)",
          fontSize: "var(--text-sm)",
          lineHeight: "var(--leading-relaxed)",
          border: isUser ? "none" : "1px solid var(--color-border-sub)",
        }}
      >
        {/* Streaming skeleton when content is empty */}
        {isEmpty && isStreamingThis ? (
          <div
            className="flex items-center gap-1 py-0.5"
            aria-label="Alex's assistant is typing"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-pulse-soft"
                style={{
                  background: "var(--color-muted)",
                  animationDelay: `${i * 0.15}s`,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Render content preserving newlines */}
            {message.content.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < message.content.split("\n").length - 1 && <br />}
              </span>
            ))}
            {/* Streaming cursor on last assistant message */}
            {isStreamingThis && !isEmpty && <StreamingCursor />}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onPromptClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4 py-8">
      {/* AI avatar — larger for empty state */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "var(--color-accent-bg)",
          border:
            "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
        }}
        aria-hidden="true"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a8 8 0 0 1 8 8v4a8 8 0 0 1-16 0v-4a8 8 0 0 1 8-8z" />
          <path d="M9 10h.01M15 10h.01" />
          <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
        </svg>
      </div>

      <div className="text-center flex flex-col gap-1">
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-md)",
            fontWeight: 600,
            color: "var(--color-fg)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          Alex&apos;s AI Assistant
        </p>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
            lineHeight: "var(--leading-snug)",
          }}
        >
          Ask about products, services,
          <br />
          availability, or pricing.
        </p>
      </div>

      {/* Suggested prompts */}
      <div className="w-full flex flex-col gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className={cn(
              "w-full text-left px-3.5 py-2.5 rounded-xl",
              "border border-[var(--color-border-sub)]",
              "transition-[border-color,background] duration-150",
              "hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
              "focus-visible:ring-offset-[var(--color-bg)]",
            )}
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-muted)",
              background: "var(--color-surface-2)",
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ChatMessages ─────────────────────────────────────────────────────────────

export function ChatMessages({ messages, isStreaming, onPromptClick }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom as stream arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex-1 overflow-y-auto overscroll-contain"
      style={{ scrollbarWidth: "thin" }}
      role="log"
      aria-live="polite"
      aria-label="Chat conversation"
    >
      {isEmpty ? (
        <EmptyState onPromptClick={onPromptClick} />
      ) : (
        <div className="flex flex-col gap-4 p-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isStreaming={isStreaming}
              isLast={index === messages.length - 1}
            />
          ))}
          {/* Scroll anchor */}
          <div ref={bottomRef} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
