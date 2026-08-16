// features/chat/ChatWidget.jsx
"use client";
//
// Root chat widget. Floating, fixed bottom-right.
//
// BLOCKING FIX:
// The container div is always rendered at full dimensions in the DOM.
// Without pointer-events-none on the container, it silently blocks
// clicks on whatever sits in the same vertical column behind it —
// even when the panel is invisible (opacity-0, scale-95).
//
// Fix:
//   Container         → pointer-events-none (always — never intercepts)
//   Panel when open   → pointer-events-auto (explicitly interactive)
//   Panel when closed → pointer-events-none (already set, now documented)
//   Trigger button    → pointer-events-auto (restored on the child)

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { EscalationCard } from "./EscalationCard";
import { useChatStream } from "@/hooks/useChatStream";

// ─── Trigger button ───────────────────────────────────────────────────────────
function TriggerButton({ onClick, hasUnread }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-14 h-14 rounded-2xl flex items-center justify-center",
        // Restore pointer events on this child — container is pointer-events-none
        "pointer-events-auto",
        "shadow-[var(--shadow-lg)]",
        "transition-[transform,box-shadow] duration-200",
        "hover:-translate-y-1",
        "hover:shadow-[var(--shadow-glow)]",
        "active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--color-bg)]",
      )}
      style={{ background: "var(--color-accent)" }}
      aria-label="Open chat with Alex's AI assistant"
      aria-haspopup="dialog"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-accent-contrast)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>

      {hasUnread && (
        <span
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: "var(--color-danger)",
            border: "2px solid var(--color-surface)",
          }}
          aria-label="New message"
        />
      )}
    </button>
  );
}

// ─── Panel header ─────────────────────────────────────────────────────────────
function PanelHeader({ onClose, onClear, hasMessages }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3.5 border-b shrink-0"
      style={{ borderColor: "var(--color-border-sub)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="relative w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--color-accent-bg)",
            border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
          }}
          aria-hidden="true"
        >
          <svg
            width="15"
            height="15"
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

          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full status-pulse"
            style={{
              background: "var(--color-success)",
              border: "2px solid var(--color-surface)",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col gap-px">
          <p
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-fg)",
              fontFamily: "var(--font-display)",
            }}
          >
            Alex&apos;s Assistant
          </p>
          <p
            style={{
              fontSize: "10px",
              color: "var(--color-success)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.03em",
            }}
          >
            ● Online · Powered by Claude
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {hasMessages && (
          <button
            onClick={onClear}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              "transition-[background,color] duration-150",
              "hover:bg-[var(--color-surface-2)]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--color-accent)]",
            )}
            style={{ color: "var(--color-faint)" }}
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        )}

        <button
          onClick={onClose}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "transition-[background,color] duration-150",
            "hover:bg-[var(--color-surface-2)]",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[var(--color-accent)]",
          )}
          style={{ color: "var(--color-faint)" }}
          aria-label="Close chat"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Error banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
  return (
    <div
      className="mx-3 mt-2 flex items-start gap-2 px-3.5 py-2.5 rounded-xl"
      style={{
        background: "var(--color-danger-bg)",
        border: "1px solid rgba(239,68,68,0.2)",
      }}
      role="alert"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-danger)"
        strokeWidth="2"
        className="shrink-0 mt-px"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p
        className="flex-1"
        style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}
      >
        {message}
      </p>
      <button
        onClick={onDismiss}
        style={{ color: "var(--color-danger)", opacity: 0.6 }}
        aria-label="Dismiss error"
        className="hover:opacity-100 transition-opacity"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ─── ChatWidget ───────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const panelRef = useRef(null);

  const {
    messages,
    isStreaming,
    error,
    escalation,
    sendMessage,
    abort,
    clearConversation,
    dismissEscalation,
  } = useChatStream();

  const open = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    if (isStreaming) abort();
  }, [isStreaming, abort]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => panelRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const [dismissedError, setDismissedError] = useState(null);
  const visibleError = error && dismissedError !== error ? error : null;

  return (
    // ── Container ──────────────────────────────────────────────────────────
    // pointer-events-none — the container itself never intercepts mouse
    // events. Each interactive child opts back in with pointer-events-auto.
    // This is the correct fix for a fixed overlay that wraps both visible
    // and invisible children — z-index alone does not solve blocking.
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 pointer-events-none sm:bottom-6 sm:right-6"
      aria-label="Chat widget"
    >
      {/* ── Panel ────────────────────────────────────────────────────────── */}
      {/* pointer-events-auto when open so the panel is fully interactive.  */}
      {/* pointer-events-none when closed — belt-and-suspenders alongside   */}
      {/* opacity-0 and scale-95. The container's none would cover this     */}
      {/* anyway, but explicit is clearer and more resilient.               */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Chat with Alex's AI assistant"
        tabIndex={-1}
        className={cn(
          "flex flex-col overflow-hidden rounded-2xl outline-none",
          "shadow-[var(--shadow-lg)]",
          "origin-bottom-right",
          "transition-[opacity,transform] duration-300",
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        )}
        style={{
          width: "min(380px, calc(100vw - 32px))",
          height: "min(580px, calc(100dvh - 96px))",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-sub)",
          isolation: "isolate",
        }}
      >
        {/* Top accent line */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-8 right-8 h-px z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
            opacity: 0.4,
          }}
        />

        <PanelHeader
          onClose={close}
          onClear={clearConversation}
          hasMessages={messages.length > 0}
        />

        {visibleError && (
          <ErrorBanner
            message={visibleError}
            onDismiss={() => setDismissedError(visibleError)}
          />
        )}

        <ChatMessages
          messages={messages}
          isStreaming={isStreaming}
          onPromptClick={sendMessage}
        />

        {escalation && (
          <EscalationCard
            escalation={escalation}
            onDismiss={dismissEscalation}
          />
        )}

        <ChatInput
          onSend={sendMessage}
          onAbort={abort}
          isStreaming={isStreaming}
          disabled={false}
        />
      </div>

      {/* ── Trigger button ──────────────────────────────────────────────── */}
      {/* pointer-events-auto restored so the button stays clickable        */}
      {/* despite the container's pointer-events-none.                      */}
      {!isOpen && <TriggerButton onClick={open} hasUnread={hasUnread} />}
    </div>
  );
}

export default ChatWidget;
