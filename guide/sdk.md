# SDKs and browser integration

Go Mode supplies generated TypeScript, Kotlin, and Swift clients for discovery, MCP, OAuth, and voice-gateway protocols. The SolidJS package adds host-mode detection and browser voice integration.

## Go packages

The module is `github.com/maruel/gomode`:

- root package: discovery handler, manifest DTOs, and voice token contracts;
- `mcp`: MCP HTTP transport and DTOs;
- `oauth`: authorization-server, client, and token-verification packages;
- `sse`: bounded Server-Sent Event frame delivery;
- `voicegateway`: embedded and standalone voice infrastructure.

Use [Go package documentation](https://pkg.go.dev/github.com/maruel/gomode) for exported APIs.

## SolidJS hosts

The `@maruel/gomode` package exports source for Solid/Vite hosts. Consume it from the GitHub repository and pin a reviewed revision in your dependency manifest and lockfile:

```bash
pnpm add github:maruel/gomode
```

Configure the host’s MCP endpoint at startup and wrap UI in the host-mode provider:

```tsx
import { configureMcpClient } from "@maruel/gomode/web/McpClient";
import { HostModeProvider } from "@maruel/gomode/web/HostMode";

configureMcpClient("/api/my-service/mcp", "my-service-web");

<HostModeProvider>
  <App />
</HostModeProvider>;
```

`HostModeProvider` detects the native shell and exposes whether browser voice and notifications should be enabled. The host keeps its product routing and state.

Import voice UI from `@maruel/gomode/web/VoiceOverlay` and settings from `@maruel/gomode/web/VoiceSettings`. Consult their source interfaces for required host-specific props; the package does not supply your product state or auth policy.

## Generated clients

| Surface                         | Reference                                                                              |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| Discovery and skill frontmatter | [sdk/gomode](https://github.com/maruel/gomode/blob/main/sdk/gomode/API.md)             |
| MCP                             | [sdk/mcp](https://github.com/maruel/gomode/blob/main/sdk/mcp/API.md)                   |
| OAuth                           | [sdk/oauth](https://github.com/maruel/gomode/blob/main/sdk/oauth/API.md)               |
| Voice gateway                   | [sdk/voicegateway](https://github.com/maruel/gomode/blob/main/sdk/voicegateway/API.md) |

TypeScript entry points are exported under `@maruel/gomode/sdk/<surface>/*`. Kotlin and Swift source lives beside each reference. The Android repository also includes the Halo SDK.

After changing wire DTOs or routes in Go Mode, maintainers run:

```bash
make generate-sdks
```

Consumers use the generated clients; generated files are not edited by hand. [The upstream package manifest](https://github.com/maruel/gomode/blob/main/package.json) is the source of truth for exports and peer dependencies.
