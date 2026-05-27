# AGENTS.md

## Cursor Cloud specific instructions

This is a minimal vanilla JavaScript frontend app (no framework) using Vite as the dev server and build tool.

### Running the app

- `npm run dev` — starts the Vite dev server on `http://localhost:5173`
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

### Key notes

- There is **no linter, formatter, or test framework** configured. The project has only one devDependency: `vite`.
- There is **no backend**. The app is purely client-side vanilla JS with DOM manipulation.
- Network panel buttons call external public APIs (`jsonplaceholder.typicode.com`, `httpbin.org`) — these require internet access.
- The app uses browser `localStorage`/`sessionStorage` for persistence (counter, theme, notes).
- No `.env` files or secrets are needed.
- No database or Docker services required.
