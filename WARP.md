# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: printorchestra – password-gated marketing site (Next.js App Router + TypeScript)

Commands
- Install dependencies
  - npm install
- Develop (Next dev server on http://localhost:3000)
  - npm run dev
- Build
  - npm run build
- Start (after build)
  - npm start
- Lint (ESLint 9 + eslint-config-next)
  - npm run lint
- Tests
  - No test framework or npm test script is configured in this repo; there is currently no way to run a single test.

Environment and auth (required for local dev)
- Required env vars (create a .env.local in the project root):
  - SITE_PASSWORD=<your password>
  - JWT_SECRET=<a long random string used to sign/verify JWTs>
- Login flow
  - app/login/page.tsx is a client component that posts to /api/login with { password } and, on success, redirects to / and refreshes the router.
  - app/api/login/route.ts compares password to SITE_PASSWORD; on mismatch it returns a 401 JSON error, on success it signs an empty JWT payload using jose and JWT_SECRET and sets it as an httpOnly cookie named token with 1-day expiry.
  - middleware.ts reads the token cookie and verifies it with jwtVerify and JWT_SECRET, redirecting unauthenticated users to /login (with ?from=<path>) and redirecting logged-in users away from /login back to /.
  - JWT_SECRET is required at runtime; getJwtSecret() in middleware.ts throws if it is missing, which will break all non-excluded routes.

High-level architecture
- Next.js App Router (app/)
  - app/layout.tsx sets up Geist and Geist_Mono fonts as CSS variables and wraps all pages in the root HTML/body, importing app/globals.css for styling.
  - app/page.tsx is the main password-protected landing page implemented as a single client component that:
    - Manages countdown state to a hard-coded launch date, mouse-position-driven spotlight effects, scroll-based header behavior (sticky header that hides over the gallery), and active section highlighting for three "Möglichkeit" sections.
    - Composes several visually distinct sections (hero, AI OS and feature sections, three cost/time/ROI option sections, gallery heading, and footer) with their behavior driven largely by CSS in app/globals.css (e.g., an IntersectionObserver adds the revealed class to .feature-card elements).
    - Uses a separate Carousel client component imported via the @/* path alias (from components/Carousel.tsx) to render a large gallery of numbered PNG images.
  - app/login/page.tsx renders a minimal password form using Tailwind utility classes and client-side state for inline error handling, calling /api/login and then router.push('/') + router.refresh() on success.
  - app/api/login/route.ts is a simple credentials check: it validates the request password against SITE_PASSWORD, signs a JWT with jose (HS256, 1-day expiry) using JWT_SECRET, and writes it into an httpOnly, path=/ cookie named token.
- Middleware-based protection (middleware.ts)
  - All routes except /api/*, Next static/image assets, and /favicon.ico are passed through middleware that reads token from cookies, verifies it with jwtVerify and JWT_SECRET, and:
    - Redirects unauthenticated users to /login, preserving the original pathname in a from query parameter.
    - Redirects logged-in users who hit /login back to /.
- Styling
  - Tailwind CSS v4 is enabled via the @tailwindcss/postcss plugin (postcss.config.mjs) and a single global stylesheet app/globals.css that:
    - Imports the Tailwind v4 entrypoint (@import "tailwindcss";) and defines an inline @theme using Geist font variables.
    - Implements nearly all layout and visual behavior (particle background, spotlight, glitch typography, hero split, animated reveal cards, per-section gradients, metrics layout, carousel layout, responsive tweaks) via custom CSS classes.
- Components and data flow
  - components/Carousel.tsx is a client component responsible for the gallery carousel; it:
    - Accepts an images array and manages the current index in state, with keyboard navigation and preloading of initial and adjacent images.
    - Uses next/image, but conditionally falls back to unoptimized paths in non-production environments; in production it manually constructs _next/image URLs to warm the image optimization cache.
  - The rest of the UI is inlined into app/page.tsx; there is no global state management library and no backend database or API beyond the single /api/login route.

Tooling
- TypeScript
  - Strict, noEmit configuration with moduleResolution: "bundler" and a path alias @/* -> project root (tsconfig.json). This alias is used for components (e.g., "@/components/Carousel").
- ESLint
  - ESLint 9 with eslint-config-next/core-web-vitals and eslint-config-next/typescript (eslint.config.mjs).
  - globalIgnores excludes .next/**, out/**, build/**, and next-env.d.ts.
- Next.js config
  - next.config.ts is minimal and only customizes image formats (AVIF and WebP) for next/image.
- Tailwind / PostCSS
  - Tailwind CSS v4 is wired through PostCSS only; there is intentionally no tailwind.config.* file, so styles are centralized in app/globals.css.

Notes for agents
- Before running npm run dev, ensure .env.local defines valid SITE_PASSWORD and JWT_SECRET; otherwise middleware.ts will throw at startup and all protected routes will fail.
- When modifying or extending the UI, prefer to:
  - Re-use the existing @/* path alias for new shared components alongside components/Carousel.tsx.
  - Keep global layout/styling changes in app/globals.css, which already defines most structural classes used by app/page.tsx.
- If you introduce a test runner (e.g., Jest, Vitest, or Playwright), add appropriate npm scripts (test, test:watch, etc.) and update this WARP.md with commands for running the full suite and a single test.
