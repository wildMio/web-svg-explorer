# Development Guide

Contributor guide for maintaining SVGOLOT, an Angular 21 PWA for batch SVG inspection, optimization, comparison, and export.

## Prerequisites

- Node.js current LTS and npm.
- A browser with File System Access support for normal workflow testing.
- Firebase CLI only when you need to validate or ship hosting changes.

## Common Commands

```bash
npm install
npm run start
npm run build
npm run lint
npm run prettier-check
firebase deploy --only hosting:web-svg-explorer
```

There is no active Karma or Jasmine workflow in this repository. Do not reintroduce legacy test scaffolding unless the task explicitly requires a new test strategy.

## Architecture Overview

- `src/app/app.component.*`: app shell, directory loading, batch actions, overlays, and active-file selection.
- `src/app/service/svg-state.service.ts`: optimized SVG state and reset behavior between directories.
- `src/app/service/svgo.service.ts`: shared compression profile and worker-backed optimization runtime.
- `src/app/svg-card/`: per-asset preview cards and one-off actions.
- `src/app/svg-markup/`: original-versus-optimized markup inspection.
- `src/app/compress-setting/`: shared SVGO profile controls.
- `src/styles.css`: global design system and most visual styling. Keep large visual rules here to avoid Angular component-style budget pressure.
- `src/app/**/*.scss`: local structural styling when a rule truly belongs to one component.

## Working Conventions

- Use standalone Angular patterns, OnPush change detection, RxJS state, ESM imports, and semicolons.
- Preserve browser-safe dependencies and flows built around `browser-fs-access`, `fflate`, and `svgo/browser`.
- Prefer root-cause fixes over surface patches, especially around directory switching, stale optimized state, and export readiness.
- Keep the UI dense and inspectable. This product is an operational review bench, not a marketing page or icon gallery.

## Design And Contributor Context

- `PRODUCT.md`: product intent, users, and quality bar.
- `DESIGN.md`: visual system and interaction rules.
- `DESIGN.json`: machine-readable design sidecar for tooling.
- `AGENTS.md`: repo-specific guardrails for contributors and coding agents.
- `HARNESSES.md`: runtime and delivery surface reference.

When the product vocabulary or interface behavior changes, keep those files aligned with the implementation. Remove stale alternates instead of leaving multiple conflicting docs in the root.

## High-Risk Areas

- Directory switching must clear optimized state for the new batch.
- `src/app/service/svgo.service.ts` affects every optimization and export path.
- Material controls still depend on theme variables; validate checkboxes, sliders, and toggles after global CSS or theme changes.
- `angular.json` component-style budgets are tight. Large visual changes usually belong in `src/styles.css`.
- `firebase.json` and `ngsw-config.json` are active config, not disposable defaults.

## Validation Expectations

- Always run `npm run build` and `npm run lint` after behavior or UI changes.
- For workflow changes, manually verify opening a directory, selecting a card, reviewing markup, running single-file optimization, running batch optimization, and exporting a ZIP.
- For PWA or hosting changes, also verify service-worker and install/update behavior.
- The existing initial bundle budget warning is known. Treat new build failures or new lint failures as regressions.

## Deployment Notes

- Production delivery uses Firebase Hosting with SPA rewrites.
- Build output is published from `dist/web-svg-explorer`.
- If output paths or service-worker files change, update hosting config and validate the deployed app before merging.
