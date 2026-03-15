# Copilot Instructions — SPFA Website

## Architecture

This is a **monorepo** (npm workspaces) using the **Backend-for-Frontend (BFF)** pattern:

- **`client/`** — React 19 SPA built with Vite 8 and TypeScript. Uses TanStack Query for data fetching, Firebase for auth, and react-gtm-module for analytics.
- **`server/`** — Express 5 BFF server in TypeScript (ES Modules). Serves the compiled client bundle from `server/public/` in production and exposes `/api/*` routes. Swagger auto-generates API docs from JSDoc annotations on routes.
- In **dev**, Vite proxies `/api` requests to Express (`vite.config.ts` proxy). In **production**, Express serves everything as a single deployable unit.

Client build output lands in `server/public/` (configured in `vite.config.ts` → `build.outDir`). Never commit `server/public/` build artifacts.

## Key Commands (always run from repo root)

| Task                                 | Command               |
| ------------------------------------ | --------------------- |
| Install all deps                     | `npm install`         |
| Dev (client HMR + server hot-reload) | `npm run dev`         |
| Production build                     | `npm run build`       |
| Start production server              | `npm start`           |
| Run all tests                        | `npm test`            |
| Client tests only                    | `npm run test:client` |
| Server tests only                    | `npm run test:server` |
| Lint                                 | `npm run lint`        |
| Format                               | `npm run format`      |
| Docker build & run                   | `docker compose up`   |

## Testing Conventions

- Jest multi-project config in `jest.config.js` at the repo root.
- **Client tests**: `client/src/**/*.test.{ts,tsx}` — run in `jsdom` environment using Testing Library + `@testing-library/user-event`.
- **Server tests**: `server/src/**/*.test.ts` — run in `node` environment using Supertest.
- Use `ts-jest` with the respective workspace's `tsconfig.json` for transforms.
- Test reports exported as Sonar-compatible XML to `reports/`.

## TypeScript & Module System

- **Server**: `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, `"type": "module"` in package.json. Use `.js` extensions in relative imports. Use `import.meta.url` instead of `__dirname`.
- **Client**: `"moduleResolution": "bundler"`, strict mode enabled, `"jsx": "react-jsx"`. No import extensions needed (Vite handles resolution).
- Both workspaces target modern JS (ES2023 / ESNext). No CommonJS.

## Code Style

- ESLint 9 flat config (`eslint.config.mjs`) with `typescript-eslint`. `no-unused-vars` and `no-explicit-any` are warnings, not errors.
- Prettier for formatting. Run `npm run format` before committing.

## Adding Features

- **New API routes**: Add to `server/src/index.ts` or extract into a `server/src/routes/` directory. Add Swagger JSDoc annotations for auto-generated API docs.
- **New React pages/components**: Add under `client/src/`. The app currently has no router — add React Router when multi-page navigation is needed.
- **Data fetching**: Use TanStack Query hooks in client components; point queries at `/api/*` endpoints.
- **OpenTelemetry**: Server tracing configured in `server/src/instrumentation.ts` (OTLP exporter to `localhost:4318`). Client includes `@opentelemetry/sdk-trace-web`.

## Docker

Multi-stage Dockerfile: build stage compiles both workspaces, production stage copies only `server/dist` + `server/public` with production deps. Exposes port 8080.
