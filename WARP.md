# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: printorchestra (Next.js App Router + TypeScript)

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
  - No test framework or npm test script is configured in this repo.

Environment and auth (required for local dev)
- Required env vars (create a .env.local in the project root):
  - SITE_PASSWORD=<your password>
  - JWT_SECRET=<a long random string used to sign/verify JWTs>
- Login flow
  - POST /api/login with { password } compares against SITE_PASSWORD. On success, a signed JWT is set in an httpOnly cookie named token (1-day expiry).
  - middleware.ts verifies the token (using jose) on every request and redirects unauthenticated users to /login. The matcher excludes /api/*, Next static/image assets, and /favicon.ico.
  - If JWT_SECRET is missing, middleware throws; ensure JWT_SECRET is set before running the app.
  - There is no logout route; during development, clear the token cookie in your browser to simulate logout.

High-level architecture
- Next.js App Router (app/)
  - app/layout.tsx sets global fonts (Geist, Geist_Mono) and imports app/globals.css.
  - app/page.tsx is a client component landing page with animated UI (countdown, particle/spotlight effects, feature cards) driven by CSS in app/globals.css and small React hooks.
  - app/login/page.tsx is a client component that posts to /api/login and, on success, navigates to /. Error states are handled locally.
  - app/api/login/route.ts signs a JWT with jose using JWT_SECRET and sets it as an httpOnly cookie named token.
- Middleware-based protection (middleware.ts)
  - Reads token from cookies and verifies it with jwtVerify and JWT_SECRET.
  - Redirects unauthenticated requests to /login; redirects logged-in users away from /login to /.
- Styling
  - Tailwind CSS v4 via PostCSS plugin only (postcss.config.mjs). No tailwind.config.* file; utility classes are available and the bulk of styles live in app/globals.css with custom animations and CSS variables.
- Tooling
  - TypeScript (strict, noEmit) with path alias @/* to project root (tsconfig.json).
  - ESLint 9 using eslint-config-next (core-web-vitals + typescript). Ignores .next/**, out/**, build/**, next-env.d.ts (eslint.config.mjs).
  - next.config.ts is minimal with default settings.

Notes for agents
- When starting the dev server without JWT_SECRET, middleware will throw at runtime. Prefer adding .env.local with SITE_PASSWORD and JWT_SECRET before running npm run dev.
- To test authenticated vs unauthenticated states quickly, toggle the presence of the token cookie (httpOnly) via browser devtools -> Application -> Cookies, or adjust SITE_PASSWORD and re-authenticate.
