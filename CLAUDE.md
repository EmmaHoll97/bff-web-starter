# CLAUDE.md — SPFA Website

This file is read by Claude Code to understand the project. Keep it up to date.

---

## Architecture

Monorepo (npm workspaces) using the **Backend-for-Frontend (BFF)** pattern:

- **`client/`** — React 19 SPA built with Vite 8 and JavaScript. Uses TanStack Query for data fetching, Firebase for auth, and react-gtm-module for analytics.
- **`server/`** — Express 5 BFF server in JavaScript (ES Modules). Serves the compiled client bundle from `server/public/` in production and exposes `/api/*` routes. Swagger auto-generates API docs from JSDoc annotations on routes.
- In **dev**, Vite proxies `/api` requests to Express (`vite.config.js` proxy). In **production**, Express serves everything as a single deployable unit.

Client build output lands in `server/public/` (configured in `vite.config.js` → `build.outDir`). **Never commit `server/public/` build artifacts.**

---

## Server Structure

All server source lives under `server/src/`:

```
server/src/
├── routers/        # Express routers — all route definitions and Swagger JSDoc annotations
├── helpers/        # Cross-service utility functions shared across the application
├── services/       # Business / service-layer logic (one file per domain)
├── schema/         # MongoDB schema definitions (Mongoose models)
└── index.js        # Main entry point — mounts routers, middleware, and starts the server
```

- **Routers** own route definitions and their Swagger annotations. Keep annotations complete and up to date on every change.
- **Helpers** are pure, reusable utilities with no service-level dependencies.
- **Services** contain all domain logic and interact with schemas/helpers. Routers call services; services do not call routers.
- **Schemas** define MongoDB models only — no business logic inside schemas.

---

## Client Structure

All client source lives under `client/src/`:

```
client/src/
├── components/         # Shared UI components reused across multiple features
├── helpers/            # Shared hooks, TanStack Query queries, API functions, and utility functions
├── features/           # Feature modules — one directory per product feature
│   └── [featureName]/  # Self-contained feature: its own components, helpers, and types
├── routers/            # Route definitions and routing logic (React Router)
└── main.jsx            # Main entry point — renders the root React component
```

### Layer responsibilities

- **`components/`** — Purely presentational, shared UI primitives and composites (buttons, modals, form fields, layout wrappers). No feature-specific logic. No direct API calls.
- **`helpers/`** — Shared hooks (`use*.js`), TanStack Query query/mutation definitions, Axios/Fetch API wrapper functions, and pure utility functions. All data-fetching logic lives here or inside the relevant feature's own helpers.
- **`features/[featureName]/`** — Everything specific to one feature lives together: its page-level components, local sub-components, feature-scoped hooks/queries. Features may have their own `components/` and `helpers/` sub-directories. Features import from `components/` and `helpers/` but never from other features.
- **`routers/`** — React Router route configuration and any route guards or layout wrappers. No business logic here.
- **`main.jsx`** — Bootstraps the app: mounts providers (QueryClientProvider, Firebase, GTM, Router) and renders the root component. Keep this file minimal.

### React component rules

- **View/Model pattern** — For non-trivial components, split into a view file (JSX + styles) and a model file (hooks, handlers, derived state). The view is a pure render; the model contains all logic.
- **Dumb components** — Components handle only their own internal UI state (e.g., open/closed, hover). All data and business logic flows in via props or hooks; components never fetch or transform data directly.
- **Single responsibility** — Each component does one thing. Decompose large components into smaller, focused ones.
- **Mobile-first and responsive** — Design for mobile breakpoints first, then enhance for tablet and desktop.
- **Cross-browser compatible** — All components must work correctly in Chrome, Firefox, Safari, and Edge.
- **No business logic in JSX** — Keep JSX clean. Move conditionals, transforms, and handlers into the model layer or helpers.
- **Prop types documented** — Use JSDoc `@param` annotations or PropTypes to document component props.

---

## Commands (always run from repo root)

```bash
npm install              # Install all deps (both workspaces)
npm run dev              # Dev: client HMR + server hot-reload
npm run build            # Production build (client → server/public)
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

---

## Testing

- Jest multi-project config in `jest.config.js` at repo root.
- **Client tests**: `client/src/**/*.test.{js,jsx}` — `jsdom` environment, Testing Library + `@testing-library/user-event`.
- **Server tests**: `server/src/**/*.test.js` — `node` environment, Supertest.
- Test reports go to `reports/` as Sonar-compatible XML.

### Testing rules (non-negotiable)

- **Unit tests** must live beside the file they test (`foo.js` → `foo.test.js`).
- **Integration tests** must live in `server/src/__tests__/` (server) or `client/src/__tests__/` (client).
- **Coverage must stay at 80% or above** — never merge a change that drops coverage below this threshold.
- **All tests must be kept up to date** with every code change. A passing test suite on stale tests is not acceptable.
- Always run `npm test` after making changes to verify nothing is broken.

---

## Module System

- **Server**: `"type": "module"` in package.json. Use `.js` extensions in relative imports. Use `import.meta.url` instead of `__dirname`.
- **Client**: Vite handles module resolution — no file extensions needed in imports.
- Both target modern JS (ES2023 / ESNext). **No CommonJS** — do not use `require()` or `module.exports`.

---

## Code Quality Standards

All code must meet the following standards without exception. These apply to every file touched in every change.

### General principles

- **DRY** — Do not repeat yourself. Extract shared logic into helpers or services before duplicating.
- **SOLID** — Apply all five principles: single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- **Amazon code quality standards** — readable, reviewable, maintainable, and correct. Code is written for the next engineer, not just the machine.

### Style rules

- **Guard clauses over nested `if` blocks** — return or throw early; keep the happy path unindented.
- **Fat arrow (arrow function) notation** — use `const fn = () => {}` over `function fn() {}` for all non-class functions.
- **Comments only where needed** — comment the _why_, not the _what_. Self-explanatory code needs no comment; non-obvious logic must have one.
- **Clean and human readable** — variable names, function names, and file names must clearly express intent.

### Swagger

- Every route change (add, modify, delete) **must** include a corresponding Swagger JSDoc annotation update.
- Annotations must reflect actual request/response shapes accurately.

---

## React Component Standards

- **View/Model pattern** — separate view logic (JSX, styles) from model logic (data transformation, event handlers). Keep them in distinct files where the component is non-trivial.
- **Dumb components** — components handle only their own internal UI state (e.g., open/closed). All data and business logic flows in via props or TanStack Query hooks.
- **Mobile and desktop compatible** — all components must be responsive. Test at mobile, tablet, and desktop breakpoints.
- **Cross-browser compatible** — all components must work in all major modern browsers (Chrome, Firefox, Safari, Edge).

---

## Code Style

- ESLint 9 flat config (`eslint.config.mjs`). `no-unused-vars` is a warning, not an error.
- Prettier for formatting. Run `npm run format` before committing.
- Use semicolons. Use single quotes. Trailing commas.

---

## Adding Features

- **New API routes**: Add a router file under `server/src/routers/`. Mount it in `index.js`. Add complete Swagger JSDoc annotations.
- **New service logic**: Add to `server/src/services/`. One file per domain.
- **New helpers**: Add to `server/src/helpers/`. Keep helpers pure and stateless where possible.
- **New MongoDB models**: Add to `server/src/schema/`. Schema files define models only.
- **New React feature**: Create a directory under `client/src/features/[featureName]/`. Add page-level and sub-components inside it.
- **Shared UI components**: Add to `client/src/components/`. Must be generic and feature-agnostic.
- **Shared hooks / queries / API calls**: Add to `client/src/helpers/`.
- **New routes**: Add to `client/src/routers/`.
- **Data fetching**: Use TanStack Query hooks; define queries in `helpers/` and point them at `/api/*` endpoints.
- **New tests**: Unit tests beside the source file; integration tests in `__tests__/`.

---

## Common Pitfalls

- Server imports **must** use `.js` extensions (ES Module resolution).
- Don't import server code from client or vice versa — they are separate workspaces.
- `server/public/` is the Vite build output directory — don't manually edit files there.
- Always run commands from the **repo root**, not from `client/` or `server/`.
- Never let test coverage drop below 80%.
- Never leave Swagger annotations out of sync with route implementations.

---

## Docker

Multi-stage Dockerfile: build stage builds the client via Vite, production stage copies `server/src` + `server/public` with production deps. Exposes port 8080.
