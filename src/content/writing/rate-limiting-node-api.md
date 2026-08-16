---
title: "Rate limiting your Node.js API: fixed window, sliding window, token bucket"
summary: "Fixed window rate limiting has a burst problem that most implementations ignore. Here is when each strategy is correct and how to implement the one that actually fits."
published: "2026-04-29"
tags: ["Architecture", "Node.js", "Systems Design"]
---

Rate limiting is one of those features that looks solved until traffic hits a boundary condition. Most Node.js APIs ship with fixed window limiting because it is simple to implement. Fixed window has a correctness problem that only surfaces at the window edge — which is exactly where an attacker, or a misconfigured client, will probe.

Understanding what each strategy actually guarantees determines which one belongs in your system.

## Fixed window — and why it fails at the boundary

The most common implementation: maintain a counter per client per time window. If the counter exceeds the limit, reject the request.

```js
// Redis-backed fixed window
async function fixedWindowLimit(clientId, limit, windowSeconds) {
  const key = `ratelimit:${clientId}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;

  const count = await redis.incr(key);
  if (count === 1) {
    // First request in this window — set expiry
    await redis.expire(key, windowSeconds);
  }

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt:
      (Math.floor(Date.now() / 1000 / windowSeconds) + 1) * windowSeconds,
  };
}
```

The problem: a client can send `limit` requests at 23:59:59 and another `limit` requests at 00:00:01. Two full windows worth of requests in two seconds. The algorithm counted correctly — each window is within limit — but the effective throughput is `2 × limit` in a two-second span.

For most internal APIs, this is acceptable. For APIs with meaningful per-client quotas — billing, third-party integrations, security-sensitive endpoints — it is not.

## Sliding window log — correct, but expensive

The sliding window log is provably correct: it counts every request in the last `windowSeconds` seconds, not the current calendar window.

```js
async function slidingWindowLog(clientId, limit, windowSeconds) {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const key = `ratelimit:log:${clientId}`;

  // Remove entries outside the window, add current timestamp, count
  await redis.zremrangebyscore(key, 0, windowStart);
  await redis.zadd(key, now, `${now}-${Math.random()}`);
  await redis.expire(key, windowSeconds);

  const count = await redis.zcard(key);

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
  };
}
```

Each request is stored as a sorted set entry. The log grows with request volume: a client making 1000 requests per minute stores 1000 entries in Redis. For high-traffic APIs with many clients, this creates memory pressure that is proportional to the number of legitimate requests — a self-defeating property.

Use sliding window log when: the correctness guarantee is mandatory, request volume is low, and the client count is bounded. Internal service-to-service APIs with strict quotas. Not public APIs.

## Token bucket — correct and efficient

The token bucket is the right default for most production APIs.

The model: each client has a bucket with a maximum capacity. Tokens refill at a fixed rate. Each request costs one token. If the bucket is empty, the request is rejected. The client can burst up to `capacity` requests, then is limited to `refillRate` requests per second.

```js
async function tokenBucket(clientId, capacity, refillRatePerSecond) {
  const key = `ratelimit:bucket:${clientId}`;
  const now = Date.now() / 1000; // seconds

  // Lua script — atomic read-compute-write in a single round trip
  const script = `
    local key = KEYS[1]
    local capacity = tonumber(ARGV[1])
    local refill_rate = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])

    local bucket = redis.call("HMGET", key, "tokens", "last_refill")
    local tokens = tonumber(bucket[1]) or capacity
    local last_refill = tonumber(bucket[2]) or now

    -- Add tokens for time elapsed since last refill
    local elapsed = now - last_refill
    tokens = math.min(capacity, tokens + elapsed * refill_rate)

    local allowed = 0
    if tokens >= 1 then
      tokens = tokens - 1
      allowed = 1
    end

    redis.call("HMSET", key, "tokens", tokens, "last_refill", now)
    redis.call("EXPIRE", key, math.ceil(capacity / refill_rate) * 2)

    return { allowed, math.floor(tokens) }
  `;

  const [allowed, remaining] = await redis.eval(
    script,
    1,
    key,
    capacity,
    refillRatePerSecond,
    now,
  );

  return {
    allowed: allowed === 1,
    remaining,
    // Approximate — tokens refill continuously, not at discrete intervals
    retryAfterSeconds: allowed ? 0 : Math.ceil(1 / refillRatePerSecond),
  };
}
```

The Lua script is the critical implementation detail. Redis executes Lua scripts atomically — no other command runs between the read and write. Without atomicity, two concurrent requests from the same client can both read a token count of 1, both consume it, and both succeed when only one should.

The token bucket guarantees the long-term rate (`refillRatePerSecond`) while permitting short bursts up to `capacity`. A client configured at 60 requests per minute can burst 60 requests immediately after a period of inactivity, then is limited to 1 request per second afterward.

## Express middleware

```js
// middleware/rateLimiter.js
export function rateLimiter({ capacity, refillRatePerSecond, keyFn }) {
  return async function (req, res, next) {
    // keyFn extracts the client identifier — IP, API key, user ID, or composite
    const clientId = keyFn(req);

    const result = await tokenBucket(clientId, capacity, refillRatePerSecond);

    // Rate limit headers — per IETF draft-ietf-httpapi-ratelimit-headers
    res.set("X-RateLimit-Limit", capacity);
    res.set("X-RateLimit-Remaining", result.remaining);

    if (!result.allowed) {
      res.set("Retry-After", result.retryAfterSeconds);
      return res.status(429).json({
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests",
          retryAfterSeconds: result.retryAfterSeconds,
        },
      });
    }

    next();
  };
}

// Usage
app.use(
  "/api/documents",
  rateLimiter({
    capacity: 60,
    refillRatePerSecond: 1,
    keyFn: (req) => req.user?.id ?? req.ip,
  }),
);

// Stricter limits for expensive endpoints
app.use(
  "/api/documents/process",
  rateLimiter({
    capacity: 5,
    refillRatePerSecond: 0.1, // 6 per minute
    keyFn: (req) => req.user?.id ?? req.ip,
  }),
);
```

## Which strategy for which situation

| Situation                                      | Strategy                               | Reason                                                        |
| ---------------------------------------------- | -------------------------------------- | ------------------------------------------------------------- |
| Public API, general use                        | Token bucket                           | Burst tolerance, memory-efficient, correct long-term rate     |
| Internal service-to-service with strict quotas | Sliding window log                     | Correctness at the boundary matters more than memory          |
| Simple abuse prevention, internal tools        | Fixed window                           | Acceptable for low-stakes limits where burst is not a concern |
| Billing-tied metered API                       | Token bucket with daily capacity reset | Burst tolerance within daily quota                            |

The choice is not about implementation complexity — token bucket and sliding window log are comparable to implement once you have the Lua pattern. The choice is about what the limit actually guarantees and whether the burst edge case matters for your use case.

If you are writing a public API with per-client quotas, it matters.
