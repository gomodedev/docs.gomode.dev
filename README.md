# docs.gomode.dev

Documentation site built with VitePress and deployed as a Cloudflare Worker.

```sh
pnpm install
pnpm run build
pnpm run dev
```

## Git deployments

Connect `main` to the `docs-gomode-dev` Worker in Cloudflare Workers →
Settings → Build. Set:

- Build command: `pnpm run build`
- Deploy command: `pnpm exec wrangler deploy`
- Version command: `pnpm exec wrangler versions upload`
- Build variable: `SKIP_DEPENDENCY_INSTALL` = `1`

Workers Builds settings live in Cloudflare. `wrangler.jsonc` configures
the Worker itself.
