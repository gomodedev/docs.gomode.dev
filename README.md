# docs.gomode.dev

Source-backed Go Mode documentation, built with VitePress and hosted as Cloudflare Workers static assets. The Android shell, host contracts, browser integration, and voice belong here. caic’s coding-agent workflows and md’s container commands belong in [caic documentation](https://docs.caic.xyz).

```bash
pnpm install --frozen-lockfile
pnpm run fix
pnpm run verify
pnpm run build
pnpm run dev
```

## Browser acceptance

```bash
pnpm exec playwright install chromium
pnpm run test
```

The suite checks desktop and mobile layout, keyboard navigation, image loading, runtime errors, and missing pages. Documentation also checks local search and native navigation. To use a locally installed Chromium instead, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable. Browser evidence is written under ignored `test-results/`.

The pinned VitePress patch preserves the search opener before autofocus, so Escape restores keyboard focus. The browser suite covers that regression.

## Go Mode publishes the screenshots and favicon

Generate the Android captures in Go Mode, then publish the captures the pages reference and the favicon:

```bash
(cd ../gomode && uv run --locked python scripts/publish_screenshots.py ../docs.gomode.dev)
(cd ../gomode && uv run --locked python scripts/publish_favicon.py ../docs.gomode.dev)
```

`public/screenshots` then holds exactly the referenced captures; Git restores it if a copy is interrupted. `pnpm run verify` checks that the committed images match the page references. Builds use committed images without a sibling checkout or emulator. Screenshots show the running Android shell and a generic demonstration host, not caic’s task UI.

## Deploy

Connect this repository’s `main` branch to the `docs-gomode-dev` Worker in Cloudflare Workers Builds:

- Build command: `pnpm install --frozen-lockfile && pnpm run build`
- Deploy command: `pnpm exec wrangler deploy`
- Preview command: `pnpm exec wrangler versions upload`
- Build variable: `SKIP_DEPENDENCY_INSTALL=1`

The account must own the `gomode.dev` zone. `wrangler.jsonc` assigns **docs.gomode.dev** as a custom domain and serves the generated `.vitepress/dist` directory with a real 404 page.

For local deployment validation without publication:

```bash
pnpm run build
pnpm exec wrangler deploy --dry-run
```

`pnpm run deploy` publishes after building; use it only when publication is intended. [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) and [custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) explain the external setup.
