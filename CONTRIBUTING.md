# Contributing

Thanks for helping improve PCSS II Robotics.

This project is content-driven, so many updates are made through JSON content and section components rather than hard-coded pages.

## Prerequisites

- Node.js `20.x` (recommended)
- npm `9+`

## Local Development

```bash
npm install
npm run dev
```

Open locally:

- <http://127.0.0.1:3142/>
- <http://127.0.0.1:3142/admin>

## Where Changes Belong

- Team/site content: `src/content/siteContent.json`
- Section components: `src/components/sections/`
- Section registry: `src/components/Sections.jsx`
- Routing behavior: `src/router.jsx`
- Content normalization: `src/data/contentModel.js`
- Content persistence: `src/data/contentStore.js`
- Global styling: `src/styles.css`

## Content Workflow

For content-only updates:

1. Edit content in `/admin`.
2. Export JSON from Admin.
3. Replace `src/content/siteContent.json` with exported JSON.
4. Run quality gates.
5. Commit and open a pull request.

Important:

- Admin edits are local to browser storage until exported and committed.
- Use Admin reset if local content state gets out of sync.

## Quality Gates

Run before pushing:

```bash
npm run lint
npm run build
```

Both commands must pass.

## Branch and Commit Guidelines

- Use short-lived branches.
- Keep commits focused and atomic.
- Write clear, conventional commit messages.

Examples:

- `feat: add sponsor showcase variant`
- `fix: harden page slug normalization`
- `docs: refresh contributor workflow`

## Pull Request Checklist

Include in every PR:

- Summary of what changed
- Why the change was needed
- Screenshots/GIFs for UI changes
- Testing notes (lint/build results)
- Follow-up items, if any

## Deployment Notes

- This is a SPA; route rewrites are configured in `vercel.json`.
- The repository uses public npm registry settings via `.npmrc`.
- Build output is `dist/`.

## Getting Help

If you are unsure where a change should go, open a draft PR with your proposal and questions. It is easier to review early than to rework late.
