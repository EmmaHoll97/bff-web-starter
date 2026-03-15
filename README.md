# ⚡ SPFA Web Starter

A production-ready monorepo starter for building modern React websites using the **Backend-for-Frontend (BFF)** pattern — the same architecture commonly used at Amazon. Clone it, install, and start building immediately.

---

## Why This Starter?

Starting a new web project usually means hours of wiring together a build tool, a server, testing, linting, observability, analytics, and auth. This repo ships with all of that **pre-installed and pre-configured** so you can skip the boilerplate and focus on your product.

---

## Architecture

```
┌────────────────────────────────────┐
│              Client                │
│  React 19 · Vite 8 · TypeScript   │
│  TanStack Query · Firebase · GTM  │
└──────────────┬─────────────────────┘
               │  /api/*
┌──────────────▼─────────────────────┐
│          BFF Server                │
│  Express 5 · TypeScript · Swagger  │
│  OpenTelemetry · Serves SPA build  │
└────────────────────────────────────┘
```

In development, Vite proxies `/api` requests to the Express server. In production, the server serves the compiled client bundle from its `public/` directory and handles API routes — a single deployable unit.

---

## Pre-Installed Packages

| Category           | Packages                                                 |
| ------------------ | -------------------------------------------------------- |
| **UI**             | React 19, React DOM                                      |
| **Build**          | Vite 8, TypeScript 5.9                                   |
| **Server**         | Express 5                                                |
| **Data Fetching**  | TanStack React Query                                     |
| **Authentication** | Firebase                                                 |
| **Analytics**      | react-gtm-module (Google Tag Manager)                    |
| **Observability**  | OpenTelemetry SDK (Node + Web), OTLP HTTP Exporter       |
| **API Docs**       | swagger-jsdoc, swagger-ui-express                        |
| **Testing**        | Jest 30, Testing Library (React + User Event), Supertest |
| **Code Quality**   | ESLint 9, Prettier, typescript-eslint                    |
| **DX**             | Concurrently, Nodemon, tsx, ts-node                      |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (uses npm workspaces)

### Install

```bash
npm install
```

This installs dependencies for the root, `client/`, and `server/` workspaces in one command.

### Development

```bash
npm run dev
```

This will:

1. Build the client once (so the server has static files to serve).
2. Start the **Vite dev server** with HMR on the default port.
3. Start the **Express BFF server** on port `8080` with hot-reload via `tsx watch`.

### Production Build

```bash
npm run build
```

Compiles the client with Vite (output → `server/public/`) and compiles the server with `tsc`.

### Start Production Server

```bash
npm start
```

Launches the Express server which serves the static client bundle and handles API routes.

---

## Project Structure

```
.
├── client/                 # React SPA (Vite)
│   ├── src/
│   │   ├── main.tsx        # Entry point
│   │   ├── App.tsx         # Root component
│   │   └── assets/         # Static assets
│   ├── public/             # Vite public directory
│   ├── vite.config.ts      # Vite config (proxy + build output)
│   └── tsconfig.json
│
├── server/                 # Express BFF
│   ├── src/
│   │   ├── index.ts        # Server entry point + routes
│   │   └── instrumentation.ts  # OpenTelemetry setup
│   ├── public/             # Built client files (generated)
│   └── tsconfig.json
│
├── jest.config.js          # Multi-project Jest config
├── eslint.config.mjs       # Shared ESLint flat config
├── package.json            # Root workspace config + scripts
└── reports/                # Test reports (Sonar-compatible)
```

---

## Scripts

All scripts are run from the **root** of the monorepo.

| Script                 | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Start client + server in parallel for local development  |
| `npm run build`        | Production build (client → server/public, server → dist) |
| `npm start`            | Start the production BFF server                          |
| `npm test`             | Run all tests (client + server)                          |
| `npm run test:watch`   | Run tests in watch mode                                  |
| `npm run test:client`  | Run client tests only                                    |
| `npm run test:server`  | Run server tests only                                    |
| `npm run lint`         | Lint all TypeScript files                                |
| `npm run lint:fix`     | Lint and auto-fix                                        |
| `npm run format`       | Format all files with Prettier                           |
| `npm run format:check` | Check formatting without writing                         |

---

## Testing

Jest is configured as a **multi-project** setup:

- **Client tests** run in a `jsdom` environment with Testing Library.
- **Server tests** run in a `node` environment with Supertest.

Test reports are output in Sonar-compatible XML via `jest-sonar-reporter` to the `reports/` directory.

---

## Observability

### Server-side

The BFF server is instrumented with the full **OpenTelemetry Node SDK** and auto-instrumentation. Traces are exported via OTLP/HTTP to `http://localhost:4318/v1/traces`. Point this at any OTLP-compatible collector (Jaeger, Grafana Tempo, AWS X-Ray, etc.).

### Client-side

The client includes `@opentelemetry/sdk-trace-web` and the XML HTTP Request instrumentation package for browser-side tracing.

---

## Customizing

1. **Add routes** — Define new API endpoints in `server/src/index.ts` or extract them into a `routes/` directory.
2. **Add pages** — Build out your React app in `client/src/`. Add a router (e.g., React Router) as needed.
3. **Configure Firebase** — Add your Firebase config to the client and initialize the SDK.
4. **Configure GTM** — Initialize `react-gtm-module` with your GTM container ID.
5. **Configure OpenTelemetry** — Update `server/src/instrumentation.ts` with your collector endpoint and service name.
6. **API Docs** — Add JSDoc annotations to your Express routes and Swagger will auto-generate docs.

---

## License

Private — see `package.json`.
