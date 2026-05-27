# Browser Playground

A minimal Vite app for exercising [Cursor’s browser tools](https://cursor.com/docs/agent/tools/browser).

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Demo video

A screen recording walkthrough of every panel is in the [demo video](https://github.com/alexisChicoine/browser-playground/raw/main/docs/browser-playground-demo.mp4) (~100s). See also [docs/browser-tour.html](docs/browser-tour.html) for a written tour.

## What to try with @browser

| Area | Panel | Tools exercised |
|------|--------|-----------------|
| Counter, modal, theme | Home | click, screenshot |
| Contact form, search | Forms | type, select, validation |
| Fetch buttons | Network | network traffic, console |
| Long list | Scroll | scroll, screenshot |
| Saved note | Home | localStorage persistence |

Example prompts:

- `@browser Open http://localhost:5173, go to Forms, fill the contact form with test data, and submit.`
- `@browser Click “Log error” on Home and read the browser console.`
- `@browser On Network, run GET success and summarize the response.`
- `@browser Scroll to the scroll target on the Scroll tab and take a screenshot.`

## Design sidebar

With the dev server running, open the page in Cursor’s browser pane and use the design sidebar to tweak layout/colors, then apply changes back to `src/style.css`.
