---
title: "Error handling is API design"
summary: "The errors your API surfaces are a contract. Most engineers write them last which is why most API error contracts are unusable."
published: "2026-04-22"
tags: ["Architecture", "Node.js", "Systems Design"]
---

Error handling gets written last. The logic goes in first, then tests, then "oh right, I should handle the error cases." The result is `throw new Error("something went wrong")` at the point of failure, a 500 response that tells the caller nothing, and a client that has to guess what happened and what to do next.

This is the wrong order. Errors are part of the API contract. Design them first.

## The problem with string errors

```js
// What most code looks like
async function createInvoice(userId, amount) {
  const user = await db.users.findById(userId);
  if (!user) throw new Error("User not found");

  if (amount <= 0) throw new Error("Invalid amount");

  const subscription = await db.subscriptions.findByUser(userId);
  if (!subscription) throw new Error("No subscription");

  return db.invoices.create({ userId, amount });
}
```

The caller catches an `Error` with a message string. To branch on what went wrong, it has to parse or match the message — which is a string comparison against text you control, that you can change, that has no stability guarantee. If the caller is a frontend, it has to decide what to show the user based on a string it received from a server it doesn't control.

The message is the only signal. It carries no machine-readable code, no HTTP status suggestion, no structured data. It is useless to anything except a human reading a log.

## Typed errors fix this

```js
class AppError extends Error {
  constructor(code, message, statusCode = 500, meta = {}) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.meta = meta;
  }
}

// Specific error types — one per failure mode that callers need to distinguish
class NotFoundError extends AppError {
  constructor(resource, id) {
    super("NOT_FOUND", `${resource} ${id} not found`, 404, { resource, id });
  }
}

class ValidationError extends AppError {
  constructor(field, reason) {
    super("VALIDATION_FAILED", `${field}: ${reason}`, 422, { field, reason });
  }
}

class PreconditionError extends AppError {
  constructor(code, message, meta = {}) {
    super(code, message, 409, meta);
  }
}
```

Now `createInvoice` looks like this:

```js
async function createInvoice(userId, amount) {
  const user = await db.users.findById(userId);
  if (!user) throw new NotFoundError("User", userId);

  if (amount <= 0)
    throw new ValidationError("amount", "must be greater than zero");

  const subscription = await db.subscriptions.findByUser(userId);
  if (!subscription)
    throw new PreconditionError(
      "NO_SUBSCRIPTION",
      "User has no active subscription",
      { userId },
    );

  return db.invoices.create({ userId, amount });
}
```

The caller can now branch on `error.code`, not on `error.message`. The HTTP status is embedded in the error — the Express handler doesn't have to guess. The `meta` field carries structured context for logs and for the client.

## The error middleware

One handler converts all `AppError` instances to consistent API responses:

```js
// middleware/errors.js
export function errorHandler(err, req, res, next) {
  // Known application error — structured response
  if (err instanceof AppError) {
    // Log at warn level — this is expected behaviour, not a bug
    logger.warn(
      { code: err.code, meta: err.meta, path: req.path },
      err.message,
    );

    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.meta && Object.keys(err.meta).length > 0
          ? { meta: err.meta }
          : {}),
      },
    });
  }

  // Unknown error — something actually broke
  // Log at error level with the full stack
  logger.error({ err, path: req.path }, "Unhandled error");

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
}
```

Two log levels, not one. `AppError` instances are warnings — they're anticipated failure modes. Unknown errors are bugs. The distinction matters for alerting: you want to know when an unhandled exception fires. You do not want an alert every time a user submits an invalid amount.

## What this means for the client

```js
// Client — can now branch on code, not message
const response = await createInvoice(userId, amount);

if (!response.ok) {
  const { error } = await response.json();

  switch (error.code) {
    case "NOT_FOUND":
      showError("Account not found. Please contact support.");
      break;
    case "VALIDATION_FAILED":
      showFieldError(error.meta.field, error.meta.reason);
      break;
    case "NO_SUBSCRIPTION":
      redirectToUpgrade();
      break;
    default:
      showError("Something went wrong. Please try again.");
  }
}
```

The client is making decisions based on a stable machine-readable contract, not a human-readable string that can change without notice.

## The rule

Before writing a function that can fail, write the errors it can produce. Not the messages — the types, the codes, the structured data the caller needs to act on them. The error contract is part of the API. It belongs in the design, not in the aftermath.

Every `throw new Error("...")` in production code is technical debt against the caller.
