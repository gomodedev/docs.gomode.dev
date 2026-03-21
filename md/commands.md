# Commands

## Container lifecycle

| Command | Description |
|---|---|
| `md start` | Create and start a container for the current branch; SSH in automatically |
| `md start -display` | Start with X11/VNC desktop environment |
| `md start -tailscale` | Start with [Tailscale](./tailscale) networking |
| `md start -usb` | Start with USB device passthrough (for ADB) |
| `md run <cmd>` | Start a temporary container, run a command, then clean up |
| `md list` | List all md containers |
| `md stop` | Stop the container (preserves filesystem) |
| `md purge` | Stop and permanently remove the container |

## Access

| Command | Description |
|---|---|
| `ssh md-<repo>-<branch>` | SSH into the container directly |
| `md vnc` | Open VNC connection to the container desktop |

## Syncing

| Command | Description |
|---|---|
| `md diff` | Show changes vs. base branch (`git diff base`). Passes through extra args, e.g. `md diff --stat` |
| `md pull` | Pull changes from container back to local branch |
| `md push` | Push local changes to the container |

## Build

| Command | Description |
|---|---|
| `md build-image` | Build the base Docker image locally as `md-local` |
| `md start -image md-local` | Start a container using the locally built image |

## Cache flags

| Flag | Description |
|---|---|
| `-no-cache <name>` | Exclude a specific default cache (repeatable) |
| `-no-caches` | Disable all default caches |
| `-cache <name>` | Enable a specific cache (use with `-no-caches`) |
| `-cache host:container` | Add a custom cache directory |

## Remote GUI (VNC)

Enable at startup, then open:

```bash
md start -display
md vnc
```

The DISPLAY environment variable is automatically set in SSH sessions, so X11 apps launched from SSH appear on the VNC desktop.

**Recommended VNC clients:**
- **Windows**: RealVNC Viewer, TightVNC, UltraVNC
- **macOS**: Built-in VNC or RealVNC Viewer
- **Linux**: `tigervnc-viewer`, `vinagre`, or `vncviewer`
