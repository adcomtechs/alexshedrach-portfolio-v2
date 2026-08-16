# DEPLOYMENT.md — Vercel Production Readiness

**Project:** alexshedrach.dev  
**Host:** Vercel  
**Framework:** Next.js App Router  
**Package manager:** pnpm

---

## 1. Current Deployment Contract

This project is prepared for Vercel deployment with:

- `vercel.json` for framework/build/install settings
- `next.config.mjs` for production headers and image/build defaults
- App Router metadata files for `robots.txt`, `sitemap.xml`, and `manifest.webmanifest`
- `pnpm deploy:check` as the pre-deploy validation command

---

## 2. Required Commands

Use pnpm for deployment parity:

```bash
pnpm install --frozen-lockfile
pnpm deploy:check
```

`deploy:check` runs:

```bash
pnpm lint && pnpm build
```

If the Windows npm shim blocks execution locally, these direct commands are valid fallbacks:

```bash
.\node_modules\.bin\eslint.CMD
node .\node_modules\next\dist\bin\next build
```

---

## 3. Vercel Settings

`vercel.json` currently defines:

| Setting          | Value                         |
| ---------------- | ----------------------------- |
| Framework        | `nextjs`                      |
| Install command  | `pnpm install --frozen-lockfile` |
| Build command    | `pnpm build`                  |
| Dev command      | `pnpm dev`                    |
| Region           | `iad1`                        |

Vercel should respect the repo settings. Avoid overriding these in the Vercel dashboard unless the repo config is updated in the same change.

---

## 4. Metadata And SEO

| Route/file                | Source file                  | Notes                                      |
| ------------------------- | ---------------------------- | ------------------------------------------ |
| `/robots.txt`             | `src/app/robots.js`          | Allows indexing only when `VERCEL_ENV=production`; blocks preview deployments |
| `/sitemap.xml`            | `src/app/sitemap.js`         | Generated from static routes and content data |
| `/manifest.webmanifest`   | `src/app/manifest.js`        | Uses existing public icons                 |
| Root metadata             | `src/app/layout.jsx`         | Uses `siteConfig` for canonical site identity |

Child routes should provide only local titles and descriptions. The root title template appends the site name.

---

## 5. Production Headers

`next.config.mjs` sets:

- `X-DNS-Prefetch-Control: on`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` disabling camera, microphone, geolocation, payment, USB, and interest-cohort

Content Security Policy is intentionally not set yet because the app uses a required inline pre-hydration theme script. Add CSP only after documenting a nonce/hash strategy.

---

## 6. Build Determinism

The site does not use `next/font/google`. Fonts are CSS variable stacks in `base.css`, which avoids Google Fonts network fetches during build.

Do not add build-time remote asset dependencies unless:

1. the dependency is required for launch,
2. failure behavior is understood,
3. Vercel caching behavior is documented,
4. local restricted-network builds still have a fallback.

---

## 7. Pre-Launch Checklist

- [ ] `pnpm deploy:check` passes
- [ ] `/robots.txt` blocks preview and allows production
- [ ] `/sitemap.xml` includes all live project, lab, and writing routes
- [ ] `/manifest.webmanifest` resolves and references existing icons
- [ ] Header sticky state works on mobile and desktop
- [ ] Mobile drawer opens, closes, and navigates correctly
- [ ] Command palette opens from keyboard and mobile drawer
- [ ] Chat widget does not block page clicks while closed
- [ ] Dark and light themes both meet visual and contrast standards
- [ ] No console errors on production preview

