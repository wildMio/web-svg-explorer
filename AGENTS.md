# Repository Guidelines

## Project Scope

This repository is an Angular 21 PWA for batch SVG inspection, optimization, comparison, and export. Treat it as a product tool, not as a skills or harness repository. Root design context lives in `PRODUCT.md`, `DESIGN.md`, and `DESIGN.json`; keep those three files aligned with the actual UI.

## Project Structure & Module Organization

`src/app/` contains the standalone app shell and feature surfaces, including `svg-card/`, `svg-markup/`, `compress-setting/`, `service/`, and shared utilities. `src/styles.css` holds the global design system and most visual styling; prefer keeping larger visual rules there to avoid Angular component-style budget pressure. `src/assets/` holds icons and static assets. `angular.json`, `postcss.config.mjs`, and `firebase.json` are active configuration files and should be preserved.

## Build, Lint, and Local Development

- `npm run start` starts the Angular dev server.
- `npm run build` is the primary production validation command.
- `npm run lint` is the primary template and TypeScript quality check.
- `npm run prettier-check` verifies formatting.

There is no active Karma or Jasmine workflow in this repository. Do not assume `ng test` exists or reintroduce test scaffolding unless the task explicitly requires a new test stack.

## Coding Style & Implementation Notes

Use Angular standalone patterns, TypeScript, ESM imports, semicolons, and the existing two-space indentation. Keep changes local and pragmatic. The app relies on `browser-fs-access`, `svgo/browser`, and `fflate` for browser-compatible file workflows; preserve those code paths. When updating visual design, prefer dense, scan-friendly workflow UI over decorative flourishes.

## Design Context Files

`PRODUCT.md` captures product strategy, `DESIGN.md` captures visual rules and tokens, and `DESIGN.json` is the sidecar used by design-aware tooling. When the interface vocabulary changes, update all three together. Remove duplicate or stale alternates rather than leaving multiple competing context files in the root.

## Validation Expectations

After UI or behavior changes, run `npm run build` and `npm run lint`. The project may still report an initial bundle-budget warning during build; treat new build failures or new lint failures as regressions.

## Contributor Notes

Firebase Hosting config is intentional and should not be removed as stale. If you move large visual rules back into component-scoped styles, watch Angular component-style budgets closely. Keep the shell explicit about file state, batch state, and export readiness; that clarity is core to the product.
