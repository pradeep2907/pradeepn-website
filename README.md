# pradeepn.in

Personal portfolio site for Pradeep Kumar — plain HTML, CSS and JavaScript. No build step.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page content and structure |
| `styles.css` | All styling (dark/light themes, responsive layout, animations) |
| `script.js` | Theme toggle, nav, scroll reveals, counters, terminal animation, skills filter, contact form |
| `profile.jpg` | **Add this** — your profile photo (reuse the one from the current site). A "PK" monogram shows if it's missing. |
| `CNAME` | Custom domain for GitHub Pages (`www.pradeepn.in`) |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Deploy on GitHub Pages

1. Copy `profile.jpg` from the current site into this folder.
2. Push these files to the root of a GitHub repository.
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick `main` and `/ (root)`.
4. For the custom domain, keep `CNAME` and point DNS at GitHub Pages (a `CNAME` record for `www` → `<username>.github.io`). Then tick **Enforce HTTPS**.

## Contact form

GitHub Pages can't run server code, so by default the form opens the visitor's email app pre-filled to `contact@pradeepn.in`.
To receive messages directly, create a free form at [formspree.io](https://formspree.io) and set `FORM_ENDPOINT` at the top of `script.js`.

## Local preview

Open `index.html` in a browser, or run `npx serve .` in this folder.
