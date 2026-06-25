# Westride — customer site

Static marketing site for Westride (Home, Services, Fleet, Contact, + Book/Rates/404).
Built with **Tailwind CSS v4**, no framework runtime — plain HTML + a little vanilla JS.
A Node build step compiles the CSS, inlines shared partials, and emits a deploy-ready
`dist/` folder with content-hashed, cache-busted assets.

See [MIGRATION.md](MIGRATION.md) for migration status and the project non-negotiables.

## Prerequisites

- **Node.js 18+** (uses ESM + `node:` built-ins)

## Setup

```bash
npm install
```

## Develop

Watch-compile the stylesheet while you edit HTML/CSS:

```bash
npm run dev      # tailwind --watch → dist/styles.css
```

`dev` only rebuilds the CSS. To preview the actual pages (with header/footer
partials inlined and CSS linked), run a full `npm run build` and open/serve `dist/`,
e.g.:

```bash
npm run build
npx serve dist      # or any static file server
```

## Build

```bash
npm run build
```

Runs the full pipeline:

1. **clean** — empty `dist/` ([scripts/clean.mjs](scripts/clean.mjs))
2. **build:css** — compile + minify Tailwind → `dist/styles.css`
3. **verify:css** — fail loudly if the CSS is empty/broken or missing theme tokens ([scripts/verify-css.mjs](scripts/verify-css.mjs))
4. **bundle** — copy `site/` → `dist/`, inline partials, content-hash the CSS, rewrite `<link>`s, write `.htaccess` ([scripts/bundle.mjs](scripts/bundle.mjs))

Output `dist/` is FTP-ready: HTML + one hashed `styles.<hash>.css` + assets + `.htaccess`.

### Individual scripts

| Command            | Does                                              |
|--------------------|---------------------------------------------------|
| `npm run dev`      | Watch-compile CSS to `dist/styles.css`            |
| `npm run build`    | Full pipeline → deploy-ready `dist/`              |
| `npm run clean`    | Empty `dist/`                                     |
| `npm run build:css`| Compile + minify CSS only                         |
| `npm run verify:css`| Guard: fail if compiled CSS is empty/broken      |
| `npm run bundle`   | Inline partials + hash/bundle into `dist/`        |

## Project structure

```
src/styles.css        Tailwind entry + @theme design tokens (single source of truth)
site/                 Authored pages
  *.html              Pages (reference partials via <!-- @include header/footer -->)
  partials/           Shared header.html + footer.html (authored once)
  assets/             images + js/main.js (vanilla, no jQuery)
scripts/              Build steps (clean / verify-css / bundle / includes)
dist/                 Generated, deploy-ready output (git-ignored)
```

## Editing shared header / footer

The nav and footer live once in [site/partials/](site/partials/). Pages pull them in
with a marker on its own line:

```html
<!-- @include header -->
...
<!-- @include footer -->
```

`scripts/bundle.mjs` inlines them at build time (no runtime fetch, no flash, fully
crawlable). Edit the partial, run `npm run build`, and every page picks up the change.

## Deploy

Upload the contents of `dist/` to the web host (FTP). The generated `.htaccess` caches
hashed assets forever and revalidates HTML on every request, so a new deploy is picked
up immediately with no stale CSS.
