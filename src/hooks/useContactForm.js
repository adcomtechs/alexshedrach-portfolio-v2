'use client';

import { useCallback, useState } from "react";

// Email validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ═══════════════════════════════════════════════════════════════
// FORM STATE MACHINE — unchanged from previous version
// ═══════════════════════════════════════════════════════════════

export function useContactForm() {
  const [state, setState] = useState("idle");
  const [errMsg, setErrMsg] = useState("");
  const [fields, setFields] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const errors = {
    name: !fields.name.trim() ? "Please enter your name." : "",
    email: !EMAIL_RE.test(fields.email)
      ? "Please enter a valid email address."
      : "",
    subject: !fields.subject ? "Please select a subject." : "",
    message:
      fields.message.trim().length < 20
        ? "Message must be at least 20 characters."
        : "",
  };

  const isValid = Object.values(errors).every((e) => !e);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFields((prev) => ({ ...prev, [name]: value }));
      if (state === "error") setState("typing");
    },
    [state],
  );

  const handleBlur = useCallback((e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setTouched({ name: true, email: true, subject: true, message: true });
      if (!isValid) {
        setState("invalid");
        return;
      }

      setState("loading");
      try {
        // ── Replace with your real API call ──────────────────────────
        // const res = await fetch("/api/contact", {
        //   method:  "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body:    JSON.stringify(fields),
        // });
        // if (!res.ok) {
        //   const { error } = await res.json().catch(() => ({}));
        //   throw new Error(error ?? "Submission failed");
        // }
        await new Promise((res) => setTimeout(res, 1600)); // simulate
        // ─────────────────────────────────────────────────────────────

        setState("success");
        setFields({ name: "", email: "", subject: "", message: "" });
        setTouched({
          name: false,
          email: false,
          subject: false,
          message: false,
        });
      } catch (err) {
        setState("error");
        setErrMsg(err.message || "Something went wrong. Please try again.");
      }
    },
    [isValid],
  );

  return {
    state,
    fields,
    touched,
    errors,
    errMsg,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
