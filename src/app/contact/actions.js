// app/contact/actions.js
"use server";
//
// Production contact form server action.
// Provider: Resend (resend.com)
//
// Environment variables required:
//   RESEND_API_KEY   — from Resend dashboard → API Keys
//   CONTACT_EMAIL    — your receiving address, e.g. hello@adcomtechs.com
//
// Domain setup required for production deliverability:
//   Verify alexshedrach.dev in Resend dashboard → Domains
//   Add the provided SPF, DKIM, and MX DNS records at your registrar.
//   Until verified, use from: "onboarding@resend.dev" (limited deliverability).

import { Resend } from "resend";

// Initialised once at module level — not per request.
const resend = new Resend(process.env.RESEND_API_KEY);

console.log("[contact action] Resend client initialized:", !!resend);
console.log("[contact action] CONTACT_EMAIL:", process.env.CONTACT_EMAIL ? "configured" : "missing");

// ─── Configuration ─────────────────────────────────────────────────────────────
// const FROM_ADDRESS = "Portfolio Contact <contact@alexshedrach.dev>";
const FROM_ADDRESS = "onboarding@resend.dev"; // To be swaped in production until domain is verified. Limited deliverability.
const REPLY_ADDRESS = "Alex Shedrach <hello@adcomtechs.com>";
const SUBJECT_PREFIX = "[Portfolio]";

// ─── Subject label map ─────────────────────────────────────────────────────────
const SUBJECT_LABELS = {
  "product-licensing": "Product Licensing",
  "custom-development": "Custom Development",
  consulting: "Technical Consulting",
  collaboration: "Content Collaboration",
  general: "General Enquiry",
};

// ─── Validation ────────────────────────────────────────────────────────────────
function validate(data) {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = "Name is required.";
  } else if (data.name.trim().length > 120) {
    errors.name = "Name must be under 120 characters.";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.subject) {
    errors.subject = "Please select a subject.";
  } else if (!Object.keys(SUBJECT_LABELS).includes(data.subject)) {
    errors.subject = "Invalid subject selection.";
  }

  if (!data.message?.trim()) {
    errors.message = "Message is required.";
  } else if (data.message.trim().length < 20) {
    errors.message = "Message must be at least 20 characters.";
  } else if (data.message.trim().length > 1200) {
    errors.message = "Message must be under 1200 characters.";
  }

  return errors;
}

// ─── HTML escape ───────────────────────────────────────────────────────────────
// All user-supplied strings pass through this before entering email HTML.
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─── Notification email → you ──────────────────────────────────────────────────
function buildNotificationHtml(data) {
  const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject;
  const timestamp = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Lagos",
    dateStyle: "full",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>New portfolio enquiry</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111113;border:1px solid #27272a;border-bottom:none;border-radius:12px 12px 0 0;padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>
                <p style="margin:0;font-size:11px;font-family:'Courier New',monospace;letter-spacing:0.1em;text-transform:uppercase;color:#b5f23d;">alexshedrach.dev</p>
                <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#f5f5f5;letter-spacing:-0.02em;">New Portfolio Enquiry</h1>
              </td>
              <td align="right" style="vertical-align:top;">
                <span style="display:inline-block;padding:4px 10px;border-radius:6px;background:rgba(181,242,61,0.1);border:1px solid rgba(181,242,61,0.25);font-size:11px;font-family:'Courier New',monospace;color:#b5f23d;">${subjectLabel}</span>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Sender -->
        <tr>
          <td style="background:#111113;border-left:1px solid #27272a;border-right:1px solid #27272a;padding:0 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1c1c1f;border-bottom:1px solid #1c1c1f;padding:20px 0;">
              <tr>
                <td width="50%" style="padding-right:16px;">
                  <p style="margin:0 0 3px;font-size:10px;font-family:'Courier New',monospace;letter-spacing:0.08em;text-transform:uppercase;color:#52525b;">From</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#f5f5f5;">${escapeHtml(data.name)}</p>
                </td>
                <td width="50%">
                  <p style="margin:0 0 3px;font-size:10px;font-family:'Courier New',monospace;letter-spacing:0.08em;text-transform:uppercase;color:#52525b;">Email</p>
                  <a href="mailto:${escapeHtml(data.email)}" style="font-size:14px;color:#b5f23d;text-decoration:none;">${escapeHtml(data.email)}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Meta -->
        <tr>
          <td style="background:#111113;border-left:1px solid #27272a;border-right:1px solid #27272a;padding:16px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td width="50%" style="padding-right:16px;">
                <p style="margin:0 0 3px;font-size:10px;font-family:'Courier New',monospace;letter-spacing:0.08em;text-transform:uppercase;color:#52525b;">Subject</p>
                <p style="margin:0;font-size:14px;color:#a1a1aa;">${subjectLabel}</p>
              </td>
              <td width="50%">
                <p style="margin:0 0 3px;font-size:10px;font-family:'Courier New',monospace;letter-spacing:0.08em;text-transform:uppercase;color:#52525b;">Received</p>
                <p style="margin:0;font-size:14px;color:#a1a1aa;">${timestamp} WAT</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="background:#111113;border-left:1px solid #27272a;border-right:1px solid #27272a;padding:0 32px 24px;">
            <p style="margin:0 0 10px;font-size:10px;font-family:'Courier New',monospace;letter-spacing:0.08em;text-transform:uppercase;color:#52525b;">Message</p>
            <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:20px;">
              <p style="margin:0;font-size:14px;color:#d4d4d8;line-height:1.75;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
            </div>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="background:#0f0f10;border:1px solid #27272a;border-top:none;border-radius:0 0 12px 12px;padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>
                <p style="margin:0;font-size:12px;color:#52525b;">Hit reply to respond directly — reply-to is pre-set to ${escapeHtml(data.name)}.</p>
              </td>
              <td align="right">
                <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;padding:8px 18px;background:#b5f23d;color:#0a0a0b;font-size:12px;font-weight:700;text-decoration:none;border-radius:8px;">Reply →</a>
              </td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Auto-reply email → sender ─────────────────────────────────────────────────
function buildAutoReplyHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Message received</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111113;border:1px solid #27272a;border-radius:12px 12px 0 0;padding:32px 32px 24px;">
            <div style="width:44px;height:44px;background:rgba(181,242,61,0.1);border:1px solid rgba(181,242,61,0.25);border-radius:10px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:14px;font-weight:700;color:#b5f23d;font-family:'Courier New',monospace;line-height:44px;display:block;text-align:center;">AS</span>
            </div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f5f5f5;letter-spacing:-0.02em;">Your message is in.</h1>
            <p style="margin:0;font-size:14px;color:#71717a;line-height:1.6;">Hi ${escapeHtml(data.name)}, thanks for reaching out. Every message gets a specific answer — not a template.</p>
          </td>
        </tr>

        <!-- What happens next -->
        <tr>
          <td style="background:#111113;border-left:1px solid #27272a;border-right:1px solid #27272a;padding:24px 32px;">
            <p style="margin:0 0 16px;font-size:10px;font-family:'Courier New',monospace;letter-spacing:0.08em;text-transform:uppercase;color:#52525b;">What happens next</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding-bottom:14px;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:12px;">
                    <span style="display:inline-block;width:22px;height:22px;background:rgba(181,242,61,0.1);border:1px solid rgba(181,242,61,0.2);border-radius:6px;text-align:center;line-height:22px;font-size:10px;font-weight:700;color:#b5f23d;font-family:'Courier New',monospace;">1</span>
                  </td>
                  <td><p style="margin:0;font-size:14px;color:#d4d4d8;line-height:1.5;">Your message has been received and will be read today.</p></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding-bottom:14px;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:12px;">
                    <span style="display:inline-block;width:22px;height:22px;background:rgba(181,242,61,0.1);border:1px solid rgba(181,242,61,0.2);border-radius:6px;text-align:center;line-height:22px;font-size:10px;font-weight:700;color:#b5f23d;font-family:'Courier New',monospace;">2</span>
                  </td>
                  <td><p style="margin:0;font-size:14px;color:#d4d4d8;line-height:1.5;">A response specific to your enquiry arrives within <strong style="color:#f5f5f5;">24 hours</strong>.</p></td>
                </tr></table>
              </td></tr>
              <tr><td>
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:12px;">
                    <span style="display:inline-block;width:22px;height:22px;background:rgba(181,242,61,0.1);border:1px solid rgba(181,242,61,0.2);border-radius:6px;text-align:center;line-height:22px;font-size:10px;font-weight:700;color:#b5f23d;font-family:'Courier New',monospace;">3</span>
                  </td>
                  <td><p style="margin:0;font-size:14px;color:#d4d4d8;line-height:1.5;">Need faster? Message on <a href="https://wa.me/2348012345678" style="color:#25D366;text-decoration:none;">WhatsApp</a> for a reply within 2 hours.</p></td>
                </tr></table>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Message echo -->
        <tr>
          <td style="background:#111113;border-left:1px solid #27272a;border-right:1px solid #27272a;padding:0 32px 24px;">
            <p style="margin:0 0 10px;font-size:10px;font-family:'Courier New',monospace;letter-spacing:0.08em;text-transform:uppercase;color:#52525b;">Your message</p>
            <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:16px 20px;">
              <p style="margin:0;font-size:13px;color:#71717a;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0f0f10;border:1px solid #27272a;border-top:1px solid #1c1c1f;border-radius:0 0 12px 12px;padding:20px 32px;">
            <p style="margin:0;font-size:12px;color:#3f3f46;line-height:1.6;">
              You received this because you submitted the contact form at
              <a href="https://alexshedrach.dev/contact" style="color:#52525b;text-decoration:none;">alexshedrach.dev/contact</a>.
              This is an automated confirmation — do not reply to this email.
              Your response will come from hello@adcomtechs.com within 24 hours.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Server action ─────────────────────────────────────────────────────────────
export async function submitContactForm(prevState, formData) {
  // Honeypot
  if (formData.get("_trap")) {
    return { status: "success", errors: {}, values: {} };
  }

  // Extract
  const data = {
    name: formData.get("name")?.trim() ?? "",
    email: formData.get("email")?.trim() ?? "",
    subject: formData.get("subject")?.trim() ?? "",
    message: formData.get("message")?.trim() ?? "",
  };

  // Validate
  const errors = validate(data);
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values: data };
  }

  // Guard env vars
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
    console.error("[contact action] Missing RESEND_API_KEY or CONTACT_EMAIL.");
    return {
      status: "error",
      errors: {
        _form:
          "Email service is not configured. Reach out directly at hello@adcomtechs.com.",
      },
      values: data,
    };
  }

  const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject;

  try {
    await Promise.all([
      // Notification → you
      resend.emails.send({
        from: FROM_ADDRESS,
        to: process.env.CONTACT_EMAIL,
        replyTo: data.email,
        subject: `${SUBJECT_PREFIX} ${subjectLabel} — ${data.name}`,
        html: buildNotificationHtml(data),
      }),
      // Auto-reply → sender
      resend.emails.send({
        from: FROM_ADDRESS,
        to: data.email,
        replyTo: REPLY_ADDRESS,
        subject: `Your message to Alex Shedrach — received`,
        html: buildAutoReplyHtml(data),
      }),
    ]);

    return { status: "success", errors: {}, values: {} };
  } catch (err) {
    console.error("[contact action] Resend error:", err);
    const message =
      err?.statusCode === 429
        ? "Too many requests. Please wait a moment and try again."
        : "Something went wrong. Please try again or email me at hello@adcomtechs.com.";
    return { status: "error", errors: { _form: message }, values: data };
  }
}

// // app/contact/actions.js
// "use server";

// // ─── Swap this import if you change email provider ────────────────────────────
// // import { Resend } from "resend";
// // const resend = new Resend(process.env.RESEND_API_KEY);
// const resend = null; // replace with real client before going live

// // ─── Validation ───────────────────────────────────────────────────────────────
// function validate(data) {
//   const errors = {};

//   if (!data.name?.trim()) {
//     errors.name = "Name is required.";
//   }

//   if (!data.email?.trim()) {
//     errors.email = "Email is required.";
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
//     errors.email = "Enter a valid email address.";
//   }

//   if (!data.subject) {
//     errors.subject = "Please select a subject.";
//   }

//   if (!data.message?.trim()) {
//     errors.message = "Message is required.";
//   } else if (data.message.trim().length < 20) {
//     errors.message = "Message must be at least 20 characters.";
//   }

//   return errors;
// }

// // ─── Server Action ────────────────────────────────────────────────────────────
// export async function submitContactForm(prevState, formData) {
//   // Honeypot — bots fill _trap, humans never do.
//   // Reject silently — return success to avoid fingerprinting the guard.
//   const trap = formData.get("_trap");
//   if (trap) {
//     return { status: "success", errors: {}, values: {} };
//   }

//   const data = {
//     name: formData.get("name"),
//     email: formData.get("email"),
//     subject: formData.get("subject"),
//     message: formData.get("message"),
//   };

//   // Validate
//   const errors = validate(data);
//   if (Object.keys(errors).length > 0) {
//     return { status: "error", errors, values: data };
//   }

//   // Send
//   try {
//     // Uncomment and configure when Resend is ready:
//     // await resend.emails.send({
//     //   from: "Portfolio Contact <contact@alexshedrach.dev>",
//     //   to: process.env.CONTACT_EMAIL,
//     //   replyTo: data.email,
//     //   subject: `[Portfolio] ${data.subject} — ${data.name}`,
//     //   html: buildEmailHtml(data),
//     // });

//     return { status: "success", errors: {}, values: {} };
//   } catch (err) {
//     console.error("[contact action]", err);
//     return {
//       status: "error",
//       errors: {
//         _form:
//           "Something went wrong. Please try again or email me directly at hello@adcomtechs.com.",
//       },
//       values: data,
//     };
//   }
// }

// // ─── Email HTML builder ───────────────────────────────────────────────────────
// // Separated from the action for testability.
// function buildEmailHtml(data) {
//   return `
//     <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#f5f5f5;background:#0b0b0c;padding:32px;border-radius:8px;">
//       <h2 style="margin:0 0 4px;font-size:20px;">${data.name}</h2>
//       <p style="color:#71717a;font-size:13px;margin:0 0 24px;">${data.email}</p>
//       <hr style="border:none;border-top:1px solid #27272a;margin:0 0 16px;">
//       <p style="margin:0 0 8px;"><strong>Subject:</strong> ${data.subject}</p>
//       <hr style="border:none;border-top:1px solid #27272a;margin:16px 0;">
//       <p style="white-space:pre-wrap;line-height:1.6;">${data.message}</p>
//     </div>
//   `.trim();
// }
