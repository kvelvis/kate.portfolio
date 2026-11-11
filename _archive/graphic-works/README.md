# Graphic works (archived)

Removed from the site on 2026-11-11 at Kate's request. Nothing was deleted.

To bring it back:
1. Move `Works/` to `src/components/sections/Works/`, `works.js` to `src/data/works.js`,
   and the images in `img/` to `src/assets/img/` (then change `./img/` back to `../assets/img/` in works.js).
2. In `src/App.jsx` import `Works` and put `<Works />` after `<About />`.
3. In `src/data/profile.js` add `{ id: "works", label: "Graphic" }` back to `navLinks`.

Before restoring: convert the PNGs to WebP (they are up to 3.8 MB each) and fill in the TODO titles/context.
