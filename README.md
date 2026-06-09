# PCSS II Robotics

Modern, content-driven website for PCSS II Robotics, built with React and Vite.

The site is designed for two audiences:

- Non-developers who update content safely through a browser admin flow.
- Developers who extend section components, routing, and design systems.

## Highlights

- Content-first architecture backed by `src/content/siteContent.json`.
- Dynamic page routing from content slugs via TanStack Router.
- Browser admin editor with local save/reset and JSON export workflow.
- Runtime hardening through content normalization and app-level error boundaries.
- Lightweight, static-host friendly deployment with Vercel SPA rewrites.

## Tech Stack

- React 18
- Vite 6
- TanStack Router
- TanStack Table
- Lucide React
- ESLint
- Plain CSS (single global stylesheet)

## Quick Start

### Prerequisites

- Node.js 20.x or 22.x (matches `engines` in package metadata)
- npm `9+`

### Install and run

```bash
npm install
npm run dev
```

Open:

- Site: <http://127.0.0.1:3142/>
- Admin: <http://127.0.0.1:3142/admin>

### Validate before merge/deploy

```bash
npm run lint
npm run build
```

## Scripts

```bash
npm run dev      # start local development server
npm run build    # build production assets into dist/
npm run build:ci # build + bundle budget checks
npm run preview  # preview built assets locally
npm run lint     # eslint checks with zero warnings allowed
npm run lighthouse # Lighthouse CI quality gates against dist/
npm run audit:high # fail on high/critical dependency vulnerabilities
```

## Production Quality Gates

- Bundle budget enforcement runs in CI through `npm run build:ci`.
- Lighthouse assertions run for pull requests and main branch updates.
- Dependency review + npm audit security checks run in dedicated workflow.
- Dependabot updates npm packages and GitHub Actions weekly.

## Project Structure

```text
.
|-- docs/                               # strategy and planning docs (md + docx)
|-- public/                             # static assets served from root
|-- src/
|   |-- admin/
|   |   |-- AdminPage.jsx               # content editor UI
|   |   `-- AdminPageRoute.jsx          # lazy-loaded admin route wrapper
|   |-- components/
|   |   |-- AppErrorBoundary.jsx
|   |   |-- Layout.jsx
|   |   |-- Pages.jsx
|   |   |-- Sections.jsx                # section registry/router
|   |   `-- sections/                   # section renderers
|   |-- content/
|   |   `-- siteContent.json            # default source-of-truth content
|   |-- data/
|   |   |-- ContentContext.jsx          # app-level content state provider
|   |   |-- contentModel.js             # normalization/sanitization logic
|   |   `-- contentStore.js             # localStorage load/save/reset/export
|   |-- main.jsx
|   |-- router.jsx
|   `-- styles.css
|-- vercel.json
`-- vite.config.js
```

## Content Workflow

### Source of truth

- Default committed content lives in `src/content/siteContent.json`.
- Home sections, pages, navigation, events, sponsors, robots, outreach, and contact are all content-driven.

### Admin editing flow

1. Open `/admin`.
2. Edit content in the browser.
3. Export JSON from the admin UI.
4. Replace `src/content/siteContent.json` with the exported content.
5. Run `npm run lint` and `npm run build`.
6. Commit and open a pull request.

### Important behavior

- Admin edits are stored in browser `localStorage` until exported/committed.
- Reset in Admin clears local state and reloads defaults from `siteContent.json`.
- Content is normalized on load to prevent malformed data from breaking rendering.

## Routing and Sections

### Routing model

- Home route is `/`.
- Admin route is `/admin` (lazy-loaded).
- Content routes are generated from `pages[].slug` in JSON.
- Duplicate/invalid slugs are defensively filtered.

### Section system

- Section rendering is registry-based in `src/components/Sections.jsx`.
- To add a new section type:

1. Create a component in `src/components/sections/`.
2. Register it in `src/components/Sections.jsx`.
3. Reference its `type` in content JSON.

## Performance and Resilience Notes

- Admin page is lazy loaded to keep initial site payload smaller.
- App crashes are isolated behind `AppErrorBoundary`.
- Content normalization enforces safe defaults for missing/invalid fields.
- Static asset strategy supports optimized formats in `public/` (for example, `webp` images).

## Deployment

This is a static Vite application.

### Generic static hosting

```bash
npm run build
```

Deploy the `dist/` directory to any static host.

### Vercel

Project is configured for clean SPA routing with rewrites in `vercel.json`:

- Any route is rewritten to `index.html`.
- Direct visits to routes like `/about` and `/admin` work without server-side routing.

Recommended Vercel settings:

- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

## Troubleshooting

### Port conflict

```bash
npm run dev -- --port 3143
```

### Content JSON errors

```bash
node --input-type=module -e "import fs from 'node:fs'; JSON.parse(fs.readFileSync('src/content/siteContent.json','utf8')); console.log('JSON OK');"
```

Then rerun:

```bash
npm run build
```

### "My admin changes disappeared"

- Changes are local until you export JSON and update `src/content/siteContent.json`.
- Browser storage can be cleared by reset actions or browser data cleanup.

## Related Documents

Detailed modernization and reusability planning docs are in `docs/`:

- `PCSS-II-Multi-Club-Reusability-Plan.md`
- `PCSS-II-Multi-Club-Reusability-Executive-Summary.md`
- `PCSS-II-Multi-Club-Reusability-Technical-Backlog.md`

## Contributing

See `CONTRIBUTING.md` for workflow and pull request expectations.

## License

MIT. See `LICENSE`.
