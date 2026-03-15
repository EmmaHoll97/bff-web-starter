# CLAUDE.md — Server Workspace

Express 5 BFF server in TypeScript with ES Modules.

## Key Details

- Entry point: `src/index.ts`
- Instrumentation: `src/instrumentation.ts` (OpenTelemetry OTLP to `localhost:4318`)
- Build output: `dist/` (compiled JS)
- Static files: `public/` (Vite client build — do NOT edit manually)
- Module system: NodeNext — **always use `.js` extensions in relative imports**
- `"type": "module"` in package.json — no CommonJS

## Dependencies

- Express 5
- swagger-jsdoc + swagger-ui-express (API docs)
- OpenTelemetry SDK (Node tracing)

## Dev Dependencies

- tsx (dev server with watch mode)
- supertest (API testing)
- TypeScript 5.9

## Scripts

- `npm run dev -w server` — tsx watch mode
- `npm run build -w server` — tsc compile
- `npm run start -w server` — node dist/index.js

## Testing

- Tests live alongside source: `src/**/*.test.ts`
- Environment: `node`
- Library: `supertest` for HTTP assertions
- Run: `npm run test:server` from repo root

## Conventions

- Use `import.meta.url` + `fileURLToPath` instead of `__dirname`
- Add Swagger JSDoc annotations to all API routes
- API routes under `/api/*` prefix
- Catch-all route serves `index.html` for client-side routing
