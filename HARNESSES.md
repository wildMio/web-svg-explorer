# Project Harnesses

Contributor reference for the runtime and delivery surfaces that make SVGOLOT work as a browser-first SVG review tool.

This repository is not a generic Angular CRUD app. The product depends on a small set of harnesses working together: browser file access, worker-backed SVG optimization, inspectable review state, PWA install/update flows, and Firebase Hosting. When one of these surfaces changes, validate the whole workflow instead of treating it like isolated UI work.

## Browser Workspace Harness

- Directory selection and file reads happen in the browser through `browser-fs-access`.
- The main batch-entry flow lives in `src/app/app.component.ts`.
- Files are filtered to `image/svg+xml` before entering review state.
- Keep normal review local-first. Do not replace this with Node-only file APIs, server upload steps, or hidden background mutation.

## Optimization Worker Harness

- Shared SVGO profile state lives in `src/app/service/svgo.service.ts`.
- Optimization runs through `src/app/worker/svgo-worker.worker.ts` so large batches do not block the shell.
- Browser-safe imports must continue to use `svgo/browser`.
- Worker messages should stay structured-clone safe and deterministic across single-file and batch optimization.

## Review And Export Harness

- `src/app/service/svg-state.service.ts` is the source of truth for optimized output.
- `src/app/svg-card/` owns per-file preview, one-off optimize, copy, invert, and download actions.
- `src/app/svg-markup/` keeps original and optimized markup inspectable beside the asset grid.
- Batch export uses `fflate` plus browser `Blob` download helpers.
- Preserve explicit file state. Original size, optimized size, delta, and export readiness should remain visible without opening devtools.

## PWA And Update Harness

- Install-prompt interception lives in `src/app/service/app-pwa.service.ts`.
- Service worker support is enabled through `angular.json` and `ngsw-config.json`.
- If install or update behavior changes, validate both browser-tab usage and installed-PWA usage.

## Hosting Harness

- Firebase Hosting is intentional and active, not leftover boilerplate.
- Hosting configuration lives in `firebase.json` and `.firebaserc`.
- The current deploy target is `hosting:web-svg-explorer` on the `svgolot` project.
- Preserve SPA rewrites and service-worker cache headers unless deployment strategy changes on purpose.

## Contributor Checklist

1. Verify the feature still works in a normal browser tab.
2. If file access changed, open a real SVG directory and confirm selection and active-card behavior.
3. If optimization changed, run one-off optimization, batch optimization, and ZIP export.
4. If PWA or hosting changed, confirm build output and service-worker behavior remain valid.
5. Run `npm run build` and `npm run lint`.
