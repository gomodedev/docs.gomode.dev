# Installation

## Prerequisites

- Docker installed and running

## Install

```bash
curl gomode.dev/install.sh | bash
```

This installs both `gomode` and `md` binaries.

## Install from source

### Dependencies

- Go 1.25+
- Docker installed and running

### Build and install

```bash
go install github.com/gomodedev/gomode/backend/cmd/gomode@latest
```

## Next steps

- [Configure gomode](./configuration) — environment variables, auth modes, systemd service
- [GitHub integration](./github) — connect GitHub for automatic PR creation
- [GitLab integration](./gitlab) — connect GitLab for automatic MR creation
- [Android app](./android) — build and install the companion app
