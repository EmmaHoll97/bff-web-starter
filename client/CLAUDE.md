# CLAUDE.md — Client Workspace

React 19 SPA built with Vite 8 and JavaScript.

## Key Details

- Entry point: `src/main.jsx`
- Main component: `src/App.jsx`
- Build output: `../server/public/` (Vite config)
- Module resolution: Vite bundler — no file extensions needed in imports

## Dependencies

- React 19, React DOM
- TanStack React Query (data fetching via `/api/*`)
- Firebase (auth)
- react-gtm-module (Google Tag Manager analytics)
- OpenTelemetry SDK for web tracing

## Testing

- Tests live alongside source: `src/**/*.test.{js,jsx}`
- Environment: `jsdom`
- Libraries: `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- Run: `npm run test:client` from repo root

## Conventions

- JSX uses automatic runtime (no `import React` needed)
- Use functional components with hooks
- Data fetching via TanStack Query hooks pointed at `/api/*` endpoints
- CSS files co-located with components
