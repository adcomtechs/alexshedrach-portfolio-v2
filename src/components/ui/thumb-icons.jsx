// components/ui/thumb-icons.jsx

export function ThumbIcon({ id, ...props }) {
  switch (id) {
    case "react":
      return (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5eead4"
          strokeWidth="1.5"
          {...props}
        >
          <circle cx="12" cy="12" r="2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4.5"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4.5"
            transform="rotate(120 12 12)"
          />
        </svg>
      );
    case "nodejs":
      return (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#86efac"
          strokeWidth="1.5"
          {...props}
        >
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        </svg>
      );
    case "postgresql":
      return (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="1.5"
          {...props}
        >
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6a8 3 0 0 0 16 0V6" />
          <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
        </svg>
      );
    case "redis":
      return (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fca5a5"
          strokeWidth="1.5"
          {...props}
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      );
    case "docker":
      return (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="1.5"
          {...props}
        >
          <rect x="2" y="8" width="4" height="4" rx="0.5" />
          <rect x="7" y="8" width="4" height="4" rx="0.5" />
          <rect x="12" y="8" width="4" height="4" rx="0.5" />
          <rect x="7" y="3" width="4" height="4" rx="0.5" />
          <path d="M22 12c-2 4-6 6-10 6a10 10 0 0 1-10-6" />
        </svg>
      );
    case "langchain":
      return (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5eead4"
          strokeWidth="1.5"
          {...props}
        >
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04z" />
        </svg>
      );
    case "tailwind":
      return (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="1.5"
          {...props}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    case "all":
      return (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#b5f23d"
          strokeWidth="1.5"
          {...props}
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    default:
      return null;
  }
}
