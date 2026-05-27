# AGENTS.md

## Cursor Cloud specific instructions

This is a simple vanilla JS + Vite single-page application. There is no backend, no database, no linter, and no test framework configured.

### Running the dev server

```bash
npm run dev -- --host 0.0.0.0
```

The app is served at `http://localhost:5173`. Use `--host 0.0.0.0` when you need the server accessible from outside localhost (e.g. for browser-based testing tools).

### Build

```bash
npm run build
```

Output goes to `dist/`.

### Notes

- There is no lint or test script in `package.json`. The only scripts are `dev`, `build`, and `preview`.
- The app uses vanilla ES modules (no TypeScript, no framework). All logic is in `src/main.js` and styles in `src/style.css`.
- Network demo buttons hit external APIs (`jsonplaceholder.typicode.com`, `httpbin.org`) — these require internet access.
