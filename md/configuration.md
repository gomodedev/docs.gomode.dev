# Configuration

## Container naming

Containers are named `md-<repo-name>-<branch-name>`. Each is locked to a repo-branch pair.

## Container setup

Each container has:

- **Isolated git clone** — `~/src/<repo-name>` inside tracks a `base` branch matching your local branch
- **User-mapped permissions** — runs as your local user ID for correct file permissions
- **SSH access** — `ssh md-<repo>-<branch>`
- **Preinstalled tools** — TypeScript, Go, Rust, Node.js, Python, Neovim, Android SDK (x64)

## Environment variables

Pass env vars via:

1. `.env` file in your repository root (auto-mounted)
2. `~/.config/md/env` on the host (applies to all containers)

```bash
# ~/.config/md/env
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
```

## Agent configuration files

These host directories are automatically mounted into each container:

- `~/.amp`, `~/.claude`, `~/.codex`, `~/.gemini`, `~/.kilocode`, `~/.kimi`, `~/.pi`, `~/.qwen`
- `~/.config/agents`, `~/.config/amp`, `~/.config/goose`, `~/.config/opencode`
- `~/.local/share/amp`, `~/.local/share/goose`, `~/.local/share/opencode`
- `~/.android` (ADB keys)

## Build cache injection

`md start` bakes your local build-tool caches into the container image at build time, so the container starts with warm caches.

| Cache name | Host path | Container path |
|---|---|---|
| `bun` | `~/.bun/install/cache` | `/home/user/.bun/install/cache` |
| `cargo` | `~/.cargo/registry`, `~/.cargo/git` | `/home/user/.cargo/{registry,git}` |
| `go-mod` | `~/go/pkg/mod` | `/home/user/go/pkg/mod` |
| `gradle` | `~/.gradle/caches`, `~/.gradle/wrapper/dists` | `/home/user/.gradle/{caches,wrapper/dists}` |
| `maven` | `~/.m2/repository` | `/home/user/.m2/repository` |
| `npm` | `~/.npm` | `/home/user/.npm` |
| `pip` | `~/.cache/pip` | `/home/user/.cache/pip` |
| `pnpm` | `~/.local/share/pnpm/store` | `/home/user/.local/share/pnpm/store` |
| `uv` | `~/.cache/uv` | `/home/user/.cache/uv` |

Caches are only included when the host directory exists; missing directories are silently skipped. The image is rebuilt only when the cache set changes, the base image updates, or the build context changes.

```bash
md start -no-cache go-mod -no-cache cargo   # skip specific caches
md start -no-caches                           # disable all caches
md start -no-caches -cache go-mod            # only go-mod
md start -cache /path/to/my/cache:/home/user/.mycache  # custom cache
```

## GitHub authentication

The container does not have access to your GitHub credentials. To authenticate:

```bash
gh auth login
```
