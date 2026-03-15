# Copilot Instructions — SPFA Website

---

## Architecture

This is a **monorepo** (npm workspaces) using the **Backend-for-Frontend (BFF)** pattern:

- **`client/`** — React 19 SPA built with Vite 8 and TypeScript. Uses TanStack Query for data fetching, Firebase for auth, and react-gtm-module for analytics.
- **`server/`** — Express 5 BFF server in TypeScript (ES Modules). Serves the compiled client bundle from `server/public/` in production and exposes `/api/*` routes. Swagger auto-generates API docs from JSDoc annotations on routes.
- In **dev**, Vite proxies `/api` requests to Express (`vite.config.ts` proxy). In **production**, Express serves everything as a single deployable unit.

Client build output lands in `server/public/` (configured in `vite.config.ts` → `build.outDir`). Never commit `server/public/` build artifacts.

---

## Server Structure

All server source lives under `server/src/`:

```
server/src/
├── routers/        # Express routers — all route definitions and Swagger JSDoc annotations
├── helpers/        # Cross-service utility functions shared across the application
├── services/       # Business / service-layer logic (one file per domain)
├── schema/         # MongoDB schema definitions (Mongoose models)
└── index.ts        # Main entry point — mounts routers, middleware, and starts the server
```

- **Routers** own route definitions and Swagger annotations. Keep annotations complete and accurate on every change.
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
└── index.tsx           # Main entry point — renders the root React component
```

### Layer responsibilities

- **`components/`** — Purely presentational, shared UI primitives and composites (buttons, modals, form fields, layout wrappers). No feature-specific logic. No direct API calls.
- **`helpers/`** — Shared hooks (`use*.ts`), TanStack Query query/mutation definitions, Axios/Fetch API wrapper functions, and pure utility functions. All data-fetching logic lives here or inside the relevant feature's own helpers.
- **`features/[featureName]/`** — Everything specific to one feature lives together: its page-level components, local sub-components, feature-scoped hooks/queries, and types. Features may have their own `components/` and `helpers/` sub-directories. Features import from `components/` and `helpers/` but never from other features.
- **`routers/`** — React Router route configuration and any route guards or layout wrappers. No business logic here.
- **`index.tsx`** — Bootstraps the app: mounts providers (QueryClientProvider, Firebase, GTM, Router) and renders the root component. Keep this file minimal.

### React component rules

- **View/Model pattern** — For non-trivial components, split into a view file (JSX + styles) and a model file (hooks, handlers, derived state). The view is a pure render; the model contains all logic.
- **Dumb components** — Components handle only their own internal UI state (e.g., open/closed, hover). All data and business logic flows in via props or hooks; components never fetch or transform data directly.
- **Single responsibility** — Each component does one thing. Decompose large components into smaller, focused ones.
- **Mobile-first and responsive** — Design for mobile breakpoints first, then enhance for tablet and desktop.
- **Cross-browser compatible** — All components must work correctly in Chrome, Firefox, Safari, and Edge.
- **No business logic in JSX** — Keep JSX clean. Move conditionals, transforms, and handlers into the model layer or helpers.
- **Prop types explicitly typed** — Always define and export a `Props` type or interface for every component.

---

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

---

## Testing Conventions

- Jest multi-project config in `jest.config.js` at the repo root.
- **Client tests**: `client/src/**/*.test.{ts,tsx}` — run in `jsdom` environment using Testing Library + `@testing-library/user-event`.
- **Server tests**: `server/src/**/*.test.ts` — run in `node` environment using Supertest.
- Use `ts-jest` with the respective workspace's `tsconfig.json` for transforms.
- Test reports exported as Sonar-compatible XML to `reports/`.

### Testing rules (non-negotiable)

- **Unit tests** must live beside the file they test (`foo.ts` → `foo.test.ts`).
- **Integration tests** must live in `server/src/__tests__/` (server) or `client/src/__tests__/` (client).
- **Coverage must stay at 80% or above** — never suggest or generate a change that drops coverage below this threshold.
- **All tests must be kept up to date** with every code change. Update or add tests for every file you touch.
- Always run `npm test` after making changes to verify nothing is broken.

---

## TypeScript & Module System

- **Server**: `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, `"type": "module"` in package.json. Use `.js` extensions in relative imports. Use `import.meta.url` instead of `__dirname`.
- **Client**: `"moduleResolution": "bundler"`, strict mode enabled, `"jsx": "react-jsx"`. No import extensions needed (Vite handles resolution).
- Both workspaces target modern JS (ES2023 / ESNext). No CommonJS — never use `require()` or `module.exports`.

---

## Code Quality Standards

All suggestions and generated code must meet the following standards without exception.

### General principles

- **DRY** — Do not repeat yourself. Extract shared logic into helpers or services before duplicating anything.
- **SOLID** — Apply all five principles: single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- **Amazon code quality standards** — code must be readable, reviewable, maintainable, and correct. Write code for the next engineer, not just the machine.

### Style rules

- **Guard clauses over nested `if` blocks** — return or throw early to keep the happy path at the top level of indentation.
- **Fat arrow (arrow function) notation** — use `const fn = () => {}` over `function fn() {}` for all non-class functions.
- **Comments only where needed** — comment the *why*, not the *what*. Self-explanatory code needs no comment; non-obvious logic must have one.
- **Clean and human readable** — variable names, function names, and file names must clearly express intent with no abbreviations that reduce clarity.

### Swagger

- Every route change (add, modify, delete) **must** include a corresponding Swagger JSDoc annotation update in the same router file.
- Annotations must accurately reflect actual request/response shapes, status codes, and authentication requirements.

---

## React Component Standards

- **View/Model pattern** — separate view logic (JSX, styles) from model logic (data transformation, event handlers). Keep them in distinct files for non-trivial components.
- **Dumb components** — components handle only their own internal UI state (e.g., toggle open/closed). All data and business logic flows in via props or TanStack Query hooks; components do not fetch or transform data themselves.
- **Mobile and desktop compatible** — all components must be fully responsive. Design mobile-first and verify at mobile, tablet, and desktop breakpoints.
- **Cross-browser compatible** — all components must work correctly in all major modern browsers: Chrome, Firefox, Safari, and Edge.

---

## Code Style

- ESLint 9 flat config (`eslint.config.mjs`) with `typescript-eslint`. `no-unused-vars` and `no-explicit-any` are warnings, not errors.
- Prettier for formatting. Run `npm run format` before committing.
- Use semicolons. Use single quotes. Trailing commas.

---

## Adding Features

- **New API routes**: Add a router file under `server/src/routers/`. Mount it in `index.ts`. Include complete Swagger JSDoc annotations.
- **New service logic**: Add to `server/src/services/`. One file per domain.
- **New helpers**: Add to `server/src/helpers/`. Keep helpers pure and stateless where possible.
- **New MongoDB models**: Add to `server/src/schema/`. Schema files define models only — no business logic.
- **New React feature**: Create a directory under `client/src/features/[featureName]/`. Add page-level and sub-components inside it.
- **Shared UI components**: Add to `client/src/components/`. Must be generic and feature-agnostic.
- **Shared hooks / queries / API calls**: Add to `client/src/helpers/`.
- **New routes**: Add to `client/src/routers/`.
- **Data fetching**: Use TanStack Query hooks; define queries in `helpers/` and point them at `/api/*` endpoints.
- **New tests**: Unit tests beside the source file; integration tests in `__tests__/`.

---

## Common Pitfalls

- Server relative imports **must** use `.js` extensions even though source files are `.ts` (NodeNext resolution).
- Never import server code from client or vice versa — they are separate workspaces.
- `server/public/` is the Vite build output directory — never manually edit files there.
- Always run commands from the **repo root**, not from `client/` or `server/`.
- Never let test coverage drop below 80%.
- Never leave Swagger annotations out of sync with route implementations.

---

## Docker

Multi-stage Dockerfile: build stage compiles both workspaces, production stage copies only `server/dist` + `server/public` with production deps. Exposes port 8080.
