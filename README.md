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

`public/notify.php` sends visits and likes to Telegram. On the hosting, put a filled-in copy of
`deploy/notify-config.example.php` next to `notify.php` as `notify-config.php`. Never commit the real one.
