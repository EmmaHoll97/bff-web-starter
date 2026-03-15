# CLAUDE.md — SPFA Website

This file is read by Claude Code to understand the project. Keep it up to date.

## Architecture

Monorepo (npm workspaces) using the **Backend-for-Frontend (BFF)** pattern:

- **`client/`** — React 19 SPA built with Vite 8 and TypeScript. Uses TanStack Query for data fetching, Firebase for auth, and react-gtm-module for analytics.
- **`server/`** — Express 5 BFF server in TypeScript (ES Modules). Serves the compiled client bundle from `server/public/` in production and exposes `/api/*` routes. Swagger auto-generates API docs from JSDoc annotations on routes.
- In **dev**, Vite proxies `/api` requests to Express (`vite.config.ts` proxy). In **production**, Express serves everything as a single deployable unit.

Client build output lands in `server/public/` (configured in `vite.config.ts` → `build.outDir`). **Never commit `server/public/` build artifacts.**

## Commands (always run from repo root)

```bash
npm install              # Install all deps (both workspaces)
npm run dev              # Dev: client HMR + server hot-reload
npm run build            # Production build (client → server/public, server → server/dist)
npm start                # Start production server
npm test                 # Run all tests (Jest multi-project)
npm run test:client      # Client tests only (jsdom)
npm run test:server      # Server tests only (node)
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier format all files
npm run format:check     # Check formatting without writing
docker compose up        # Docker build & run
```

## Testing

- Jest multi-project config in `jest.config.js` at repo root.
- **Client tests**: `client/src/**/*.test.{ts,tsx}` — `jsdom` environment, Testing Library + `@testing-library/user-event`.
- **Server tests**: `server/src/**/*.test.ts` — `node` environment, Supertest.
- Both use `ts-jest` with their respective `tsconfig.json`.
- Test reports go to `reports/` as Sonar-compatible XML.
- Always run `npm test` after making changes to verify nothing is broken.

## TypeScript & Module System

- **Server**: `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, `"type": "module"` in package.json. **Use `.js` extensions in relative imports** (e.g., `import { foo } from './utils.js'`). Use `import.meta.url` instead of `__dirname`.
- **Client**: `"moduleResolution": "bundler"`, strict mode, `"jsx": "react-jsx"`. No import extensions needed (Vite handles resolution).
- Both target modern JS (ES2023 / ESNext). **No CommonJS** — do not use `require()` or `module.exports`.

## Code Style

- ESLint 9 flat config (`eslint.config.mjs`) with `typescript-eslint`. `no-unused-vars` and `no-explicit-any` are warnings, not errors.
- Prettier for formatting. Run `npm run format` before committing.
- Use semicolons. Use single quotes. Trailing commas.

## Adding Features

- **New API routes**: Add to `server/src/index.ts` or extract into `server/src/routes/`. Add Swagger JSDoc annotations.
- **New React pages/components**: Add under `client/src/`. No router yet — add React Router when multi-page navigation is needed.
- **Data fetching**: Use TanStack Query hooks in client components; point queries at `/api/*` endpoints.
- **New tests**: Co-locate test files next to source files with `.test.ts` / `.test.tsx` suffix.

## Common Pitfalls

- Server imports **must** use `.js` extensions even though source files are `.ts` (NodeNext resolution).
- Don't import server code from client or vice versa — they are separate workspaces.
- `server/public/` is the Vite build output directory — don't manually edit files there.
- Always run commands from the **repo root**, not from `client/` or `server/`.

## Docker

Multi-stage Dockerfile: build stage compiles both workspaces, production stage copies only `server/dist` + `server/public` with production deps. Exposes port 8080.
