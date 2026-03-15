# CLAUDE.md — Server Workspace

Express 5 BFF server in JavaScript with ES Modules.

## Key Details

- Entry point: `src/index.js`
- Instrumentation: `src/instrumentation.js` (OpenTelemetry OTLP to `localhost:4318`)
- Static files: `public/` (Vite client build — do NOT edit manually)
- Module system: ES Modules — **always use `.js` extensions in relative imports**
- `"type": "module"` in package.json — no CommonJS

## Dependencies

- Express 5
- swagger-jsdoc + swagger-ui-express (API docs)
- OpenTelemetry SDK (Node tracing)

## Dev Dependencies

- supertest (API testing)

## Scripts

- `npm run dev -w server` — node --watch mode
- `npm run start -w server` — node src/index.js

## Testing

- Tests live alongside source: `src/**/*.test.js`
- Environment: `node`
- Library: `supertest` for HTTP assertions
- Run: `npm run test:server` from repo root

## Conventions

- Use `import.meta.url` + `fileURLToPath` instead of `__dirname`
- Add Swagger JSDoc annotations to all API routes
- API routes under `/api/*` prefix
- Catch-all route serves `index.html` for client-side routing
