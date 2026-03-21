# Configuration

All configuration is via environment variables. Flags take precedence when set. See [`contrib/gomode.env`](https://github.com/gomodedev/gomode/blob/main/contrib/gomode.env) for a template.

## Core variables

| Variable | Flag | Required | Default | Description |
|---|---|---|---|---|
| `CAIC_HTTP` | `-http` | Yes | — | HTTP listen address (e.g. `:8080`). Port-only addresses listen on localhost. Use `0.0.0.0:8080` to listen on all interfaces. |
| `CAIC_ROOT` | `-root` | Yes | — | Parent directory containing your git repositories. Each subdirectory is a repo gomode can manage. |
| `CAIC_LOG_LEVEL` | `-log-level` | No | `info` | Log verbosity: `debug`, `info`, `warn`, `error`. |
| `CAIC_LLM_PROVIDER` | — | No | — | AI provider for LLM features (title generation). E.g. `anthropic`, `gemini`, `openaichat`. |
| `CAIC_LLM_MODEL` | — | No | — | Model name for LLM features (e.g. `claude-haiku-4-5-20251001`). |
| `GEMINI_API_KEY` | — | No | — | Gemini API key for the Gemini Live voice agent. |
| `TAILSCALE_API_KEY` | — | No | — | Tailscale API key for Tailscale ephemeral node. |

## Running

```bash
# Via flags:
gomode -root ~/src

# Via environment variables:
CAIC_HTTP=:8080 CAIC_ROOT=~/src gomode
```

## systemd user service

```bash
mkdir -p ~/.config/systemd/user ~/.config/gomode
cp contrib/gomode.service ~/.config/systemd/user/
cp contrib/gomode.env ~/.config/gomode/gomode.env
# Edit ~/.config/gomode/gomode.env to set CAIC_HTTP, CAIC_ROOT, and any API keys.
systemctl --user daemon-reload
systemctl --user enable --now gomode
```

View logs:

```bash
journalctl --user -u gomode -f
```

When gomode is reinstalled (binary replaced), the service detects the change and restarts automatically.

## IP geolocation and country allowlist

gomode can optionally resolve client IP addresses to country codes using a [MaxMind](https://www.maxmind.com/) MMDB file and enforce a country-based allowlist.

| Variable | Description |
|---|---|
| `CAIC_IPGEO_DB` | Path to MMDB file. Relative paths resolve against `~/.config/gomode/`. |
| `CAIC_IPGEO_ALLOWLIST` | Comma-separated list of permitted values. Unlisted IPs get HTTP 403. |

Allowlist values: `local` (loopback + RFC-1918), `tailscale` (100.64.0.0/10), or ISO 3166-1 alpha-2 country codes.

```bash
# Allow only Tailscale and Canadian connections:
CAIC_IPGEO_DB=GeoLite2-Country.mmdb
CAIC_IPGEO_ALLOWLIST=tailscale,CA

# Allow only local and Tailscale (no MMDB needed):
CAIC_IPGEO_ALLOWLIST=tailscale,local
```

## HTTPS exposure

OAuth login and webhooks require `CAIC_EXTERNAL_URL`. Webhooks additionally require GitHub to reach gomode from the internet.

> **Warning:** enable OAuth authentication **before** exposing gomode on the internet.

### Tailscale Serve (private, tailnet only)

```bash
tailscale serve --bg 8080
CAIC_EXTERNAL_URL=https://<hostname>.<tailnet>.ts.net
```

### Tailscale Funnel (public, webhooks supported)

```bash
tailscale funnel 8080
CAIC_EXTERNAL_URL=https://<hostname>.<tailnet>.ts.net
```

### Caddy + DDNS (home server)

```
<your-domain> {
    reverse_proxy localhost:8080
}
```

```
CAIC_EXTERNAL_URL=https://<your-domain>
```
