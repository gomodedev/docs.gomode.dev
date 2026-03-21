# Tailscale

The `-tailscale` flag enables [Tailscale](https://tailscale.com) networking inside the container, allowing SSH access from any machine on your tailnet and serving HTTP over HTTPS on the tailnet.

## Setup

### 1. Create an API access key

Create a key at [login.tailscale.com/admin/settings/keys](https://login.tailscale.com/admin/settings/keys) (select "API access token"), then set it:

```bash
export TAILSCALE_API_KEY=tskey-api-...
```

Without this key, you'll need to authenticate via browser each time.

### 2. Configure ACL policy

Edit your ACL at [login.tailscale.com/admin/acls](https://login.tailscale.com/admin/acls):

```json
"tagOwners": {
  "tag:md": ["your-email@example.com"]
},
"ssh": [
  {
    "action": "accept",
    "src":    ["autogroup:members"],
    "dst":    ["tag:md"],
    "users":  ["autogroup:nonroot"]
  }
]
```

## Usage

```bash
md start -tailscale
```

The container's Tailscale hostname may have a `-2` suffix; check the FQDN printed on SSH login or use `md list`.

### SSH from any tailnet machine

```bash
ssh user@<host>.<tailnet>.ts.net
```

Add to `~/.ssh/config` to avoid typing `user@`:

```
Host md-*.*.ts.net
    User user
```

### VNC over Tailscale

```bash
md start -tailscale -display
vncviewer <host>.<tailnet>.ts.net:5901
```

### HTTP server over tailnet HTTPS

Inside the container:

```bash
tailscale serve --bg 8080
```

Then open `https://<host>.<tailnet>.ts.net` from any tailnet device.

## Cleanup

When you run `md stop`:

- Ephemeral nodes (API key auth) are automatically removed from the tailnet
- Browser-authenticated nodes must be deleted manually at [login.tailscale.com/admin/machines](https://login.tailscale.com/admin/machines)
