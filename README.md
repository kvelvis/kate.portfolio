# Portfolio

Personal portfolio site: React + Vite, GSAP, Three.js.

```bash
npm install
npm run dev      # local server
npm run build    # production build → dist/
npm run lint
```

## Structure

- `src/data/` — all content: profile, projects (`work.js`), project panels (`caseStudies.js`)
- `src/sections/` — page sections (Hero, Profile, Work, About, Contact)
- `src/webgl/` — badge on the lanyard (`badge.js`), project sphere (`sphere.js`), GIF decoder (`gif.js`)
- `public/cases/` — the project sites themselves, opened through `public/preview.html`
- `site.config.js` — domain and SEO settings used at build time

## Visit notifications

Visits, opened projects and likes go to Telegram through a Cloudflare Worker (`worker/notify.js`),
because GitHub Pages can't run server code. The bot token lives only in the worker's secrets
(`TG_TOKEN`, `TG_CHAT`); its URL is `ENDPOINT` in `src/app/notify.js`.
