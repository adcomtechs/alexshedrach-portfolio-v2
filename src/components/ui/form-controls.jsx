// components/ui/form-controls/form-controls.jsx
"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useState, useCallback } from "react";

// ─── Shared label style ────────────────────────────────────────────────────────
//
// font-mono class is NOT registered in @theme — Next.js injects --font-mono via
// the Syne/Outfit/JetBrains_Mono variables in layout.tsx. Using the class risks
// a no-op if Tailwind can't resolve the variable. Inline style is authoritative.
const labelStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-xs)",
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: "var(--color-muted)",
};

// ─── Shared helper text style ─────────────────────────────────────────────────
const helperStyle = {
  fontSize: "var(--text-xs)",
  lineHeight: "var(--leading-snug)",
};

// ─── Error icon ───────────────────────────────────────────────────────────────
function ErrorIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ─── FieldLabel ───────────────────────────────────────────────────────────────
function FieldLabel({ htmlFor, required, children }) {
  return (
    <label htmlFor={htmlFor} style={labelStyle}>
      {children}
      {required && (
        <span className="text-[var(--color-accent)] ml-1" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

// ─── FieldError ───────────────────────────────────────────────────────────────
function FieldError({ id, message }) {
  return (
    <span
      id={id}
      role="alert"
      style={{ ...helperStyle, color: "var(--color-danger)" }}
      className="flex items-center gap-1"
    >
      <ErrorIcon />
      {message}
    </span>
  );
}

// ─── FieldHint ────────────────────────────────────────────────────────────────
function FieldHint({ id, message }) {
  return (
    <span id={id} style={{ ...helperStyle, color: "var(--color-faint)" }}>
      {message}
    </span>
  );
}

// ─── Base input classes ───────────────────────────────────────────────────────
const baseInputClasses = [
  "w-full rounded-lg",
  "bg-[var(--color-surface-2)] border border-[var(--color-border)]",
  "text-[var(--color-fg)] placeholder:text-[var(--color-faint)]",
  "transition-colors duration-150 outline-none",
  "hover:border-[var(--color-border)]",
  "focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]",
  "disabled:opacity-40 disabled:cursor-not-allowed",
].join(" ");

const errorInputClasses =
  "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]";

// ─── Input ────────────────────────────────────────────────────────────────────

/**
 * Input
 *
 * Single-line text field. Token-compliant, accessible, and consistent with
 * the form control visual language.
 *
 * @param {string}    label     - Field label. Auto-generates `id` if not provided.
 * @param {string}    error     - Validation error message. Renders danger state.
 * @param {string}    hint      - Helper text. Suppressed when `error` is present.
 * @param {ReactNode} icon      - Leading icon. Rendered at 16px, pointer-events-none.
 * @param {boolean}   required  - Renders asterisk and forwards `required` to input.
 * @param {string}    id        - Explicit id. Overrides auto-generated value.
 */
export const Input = forwardRef(function Input(
  { label, error, hint, icon, required, className, id, ...props },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <FieldLabel htmlFor={inputId} required={required}>
          {label}
        </FieldLabel>
      )}

      <div className="relative">
        {icon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)] pointer-events-none"
            aria-hidden
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          style={{ fontSize: "var(--text-sm)" }}
          className={cn(
            baseInputClasses,
            "h-10 px-3",
            icon && "pl-9",
            error && errorInputClasses,
            className,
          )}
          {...props}
        />
      </div>

      {error && <FieldError id={`${inputId}-error`} message={error} />}
      {hint && !error && <FieldHint id={`${inputId}-hint`} message={hint} />}
    </div>
  );
});

// ─── Select ───────────────────────────────────────────────────────────────────

/**
 * Select
 *
 * Dropdown control. Appearance reset with custom chevron.
 * Passes children directly — compose <option> elements as normal.
 */
export const Select = forwardRef(function Select(
  { label, error, hint, required, children, className, id, ...props },
  ref,
) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <FieldLabel htmlFor={selectId} required={required}>
          {label}
        </FieldLabel>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={!!error}
          style={{ fontSize: "var(--text-sm)" }}
          className={cn(
            baseInputClasses,
            "h-10 px-3 pr-8 appearance-none cursor-pointer",
            error && errorInputClasses,
            className,
          )}
          {...props}
        >
          {children}
        </select>

        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)] pointer-events-none"
          aria-hidden
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {error && <FieldError id={`${selectId}-error`} message={error} />}
      {hint && !error && <FieldHint id={`${selectId}-hint`} message={hint} />}
    </div>
  );
});

// ─── Textarea ─────────────────────────────────────────────────────────────────

/**
 * Textarea
 *
 * Multi-line text field. When `maxLength` is provided, a live character counter
 * is rendered. The counter turns danger-colored at 90% capacity.
 *
 * Works in both controlled (`value` prop) and uncontrolled (`defaultValue`) modes.
 * In controlled mode, pass `value` and `onChange` — the counter reads `value.length`.
 * In uncontrolled mode, the counter tracks input events locally.
 *
 * @param {number}  maxLength  - Maximum character count. Enables live counter.
 * @param {number}  rows       - Visible rows. Defaults to 4.
 */
export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    required,
    className,
    id,
    maxLength,
    rows = 4,
    value,
    defaultValue,
    onChange,
    ...props
  },
  ref,
) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const isControlled = value !== undefined;

  // Local count for uncontrolled mode. Initialized from defaultValue if present.
  const [localCount, setLocalCount] = useState(() =>
    typeof defaultValue === "string" ? defaultValue.length : 0,
  );

  const handleChange = useCallback(
    (e) => {
      if (!isControlled) setLocalCount(e.target.value.length);
      onChange?.(e);
    },
    [isControlled, onChange],
  );

  const charCount = isControlled ? (value?.length ?? 0) : localCount;

  const nearLimit = maxLength && charCount >= Math.floor(maxLength * 0.9);
  const atLimit = maxLength && charCount >= maxLength;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor={textareaId} required={required}>
            {label}
          </FieldLabel>

          {maxLength && (
            <span
              style={{
                ...helperStyle,
                fontFamily: "var(--font-mono)",
                color: atLimit
                  ? "var(--color-danger)"
                  : nearLimit
                    ? "var(--color-warning)"
                    : "var(--color-faint)",
                transition: "color 150ms",
              }}
              aria-live="polite"
              aria-atomic="true"
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        required={required}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${textareaId}-error`
            : hint
              ? `${textareaId}-hint`
              : undefined
        }
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={handleChange}
        style={{ fontSize: "var(--text-sm)" }}
        className={cn(
          baseInputClasses,
          "px-3 py-2.5 resize-none",
          error && errorInputClasses,
          className,
        )}
        {...props}
      />

      {error && <FieldError id={`${textareaId}-error`} message={error} />}
      {hint && !error && <FieldHint id={`${textareaId}-hint`} message={hint} />}
    </div>
  );
});

// ─── Toggle ───────────────────────────────────────────────────────────────────

/**
 * Toggle
 *
 * Checkbox-backed toggle switch. Suitable for boolean settings.
 *
 * @param {string}  label       - Primary toggle label.
 * @param {string}  description - Optional supporting description below the label.
 * @param {string}  id          - Required for label association.
 */
export function Toggle({ label, description, id, ...props }) {
  return (
    <label
      htmlFor={id}
      className="flex items-start justify-between gap-4 cursor-pointer group"
    >
      <div className="flex flex-col gap-0.5">
        <span
          style={{ fontSize: "var(--text-sm)", color: "var(--color-fg)" }}
          className="group-has-[:disabled]:opacity-40"
        >
          {label}
        </span>
        {description && (
          <span style={{ ...helperStyle, color: "var(--color-faint)" }}>
            {description}
          </span>
        )}
      </div>

      <div className="relative shrink-0 mt-0.5">
        <input type="checkbox" id={id} className="sr-only peer" {...props} />

        {/* Track */}
        <div
          className={cn(
            "w-9 h-5 rounded-full border border-[var(--color-border)]",
            "bg-[var(--color-surface-2)]",
            "transition-colors duration-200",
            "peer-checked:bg-[var(--color-accent)] peer-checked:border-[var(--color-accent)]",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent)]",
            "peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-[var(--color-bg)]",
            "peer-disabled:opacity-40 peer-disabled:cursor-not-allowed",
          )}
        />

        {/* Thumb — peer-checked:bg-[var(--color-bg)] fixes the #0a0a0b light-theme bug */}
        <div
          className={cn(
            "absolute top-[3px] left-[3px] w-[14px] h-[14px] rounded-full",
            "bg-[var(--color-faint)]",
            "transition-all duration-200",
            "peer-checked:translate-x-4 peer-checked:bg-[var(--color-bg)]",
          )}
        />
      </div>
    </label>
  );
}
