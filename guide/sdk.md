# SDKs and browser integration

Go Mode supplies generated TypeScript, Kotlin, and Swift clients for discovery, MCP, OAuth, and voice-gateway protocols. The SolidJS package adds host-mode detection and browser voice integration.

## Go packages

The module is `github.com/gomodedev/gomode`:

- root package: discovery handler, manifest DTOs, and voice token contracts;
- `mcp`: MCP Streamable HTTP endpoint, resource subscriptions, and DTOs;
- `oauth`: authorization-server, client, and token-verification packages;
- `devicelogin`: browser pairing with explicit approval and host session issuance;
- `httpserver`: trusted request metadata, host checks, access logs, tracing, and optional GeoIP;
- `sse`: bounded Server-Sent Event frame delivery;
- `voicegateway`: embedded and standalone voice infrastructure.

Use [Go package documentation](https://pkg.go.dev/github.com/gomodedev/gomode) for exported APIs.

## SolidJS hosts

The `@gomodedev/gomode` package exports source for Solid/Vite hosts. Consume it from the GitHub repository and pin a reviewed revision in your dependency manifest and lockfile:

```bash
pnpm add github:gomodedev/gomode
```

Configure the host’s MCP endpoint at startup and wrap UI in the host-mode provider:

```tsx
import { configureMcpClient } from "@gomodedev/gomode/web/McpClient";
import { HostModeProvider } from "@gomodedev/gomode/web/HostMode";

configureMcpClient("/api/my-service/mcp", "my-service-web");

<HostModeProvider>
  <App />
</HostModeProvider>;
```

The MCP endpoint must be a same-origin path or URL. `HostModeProvider` detects the native shell and exposes whether browser voice and notifications should be enabled. The host keeps its product routing and state.

| Module                                     | Purpose                                                                     |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `@gomodedev/gomode/web/FrontendVoiceTools` | Bridge 3 authentication, frontend tool registration, and readiness          |
| `@gomodedev/gomode/web/BrowserVoiceShell`  | Browser voice discovery, setup, and runtime                                 |
| `@gomodedev/gomode/web/VoiceOverlay`       | Voice bar, transcript, and tool history                                     |
| `@gomodedev/gomode/web/VoiceSettings`      | Voice setup, speech stages, speaking voice, speed, and language settings    |
| `@gomodedev/gomode/web/VoiceMessages`      | English labels; `/de`, `/es`, and `/fr` hold translations                   |
| `@gomodedev/gomode/web/notifications`      | Browser notification permission, delivery, dismissal, and voice suppression |
| `@gomodedev/gomode/web/DeviceLogin`        | Device sign-in code display and approval                                    |

[Authentication](./authentication) shows how to publish identity and register frontend tools. Frontend tools receive the conversation’s `sessionID`, an abort signal, and `isCurrent()`. Check `isCurrent()` after awaited work and before committing navigation or another host action. A call that runs longer than five seconds fails.

`BrowserVoiceShell` takes the expected service and tool-group names, the client name, and the preparation scope. It discovers the manifest only in browser mode and only when the scope is ready. An external gateway needs a same-origin token endpoint and an `authorize(endpoint)` callback that performs the host’s token exchange. A missing discovery route means voice is unavailable; a malformed manifest is a setup error.

`VoiceSettings` offers the same setup as Android: **All-in-one** with a realtime model, or **Separate stages** with **Recognition**, **Language model**, and **Speech**, where **Browser** selects the browser’s speech APIs. It also offers the voice language, speaking voice, and speaking speed, and saves each of them. An active session locks them. The choices, models, and speaking voices come from the gateway, so a host that offers several backends does not model them itself.

The host decides which product events become alerts and when they expire.

`authorize(endpoint)` owns the host’s token exchange: its method, headers, response validation, and session policy. Capture the owning host session in it instead of looking up a replacement identity after an await. The optional `mcpEndpoint` decorator binds the validated endpoint to captured host authority, and `gatewayHeaders` go only to same-origin gateway signaling. The gateway origin must use HTTPS, except `localhost` and loopback addresses during development. The [`BrowserVoiceShell` source](https://github.com/gomodedev/gomode/blob/main/web/src/BrowserVoiceShell.tsx) defines the full contract.

## Generated clients

| Surface                         | Reference                                                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discovery and skill frontmatter | [sdk/gomode v1](https://github.com/gomodedev/gomode/blob/main/sdk/gomode/API.v1.md)                                                                                             |
| MCP                             | [sdk/mcp v1](https://github.com/gomodedev/gomode/blob/main/sdk/mcp/API.v1.md)                                                                                                   |
| OAuth                           | [sdk/oauth v1](https://github.com/gomodedev/gomode/blob/main/sdk/oauth/API.v1.md)                                                                                               |
| Voice gateway                   | [sdk/voicegateway v2](https://github.com/gomodedev/gomode/blob/main/sdk/voicegateway/API.v2.md), [v1](https://github.com/gomodedev/gomode/blob/main/sdk/voicegateway/API.v1.md) |

Every SDK import names its protocol version; there are no unversioned exports. TypeScript entry points are `@gomodedev/gomode/sdk/gomode/v1/api.gen`, `sdk/mcp/v1/types.gen`, `sdk/oauth/v1/types.gen`, and `sdk/voicegateway/v2/api.gen` under the same package prefix. Kotlin packages end in `.sdk.v1` or `.sdk.v2`. Swift modules are `GoModeSDKV1`, `MCPSDKV1`, `OAuthSDKV1`, `VoiceGatewaySDKV1`, and `VoiceGatewaySDKV2`. The Android repository also includes the Halo SDK.

Voice gateway v2 is the current signaling and data-channel contract. The gateway still serves v1 for clients built against the v0.3.0 release.

After changing wire DTOs or routes in Go Mode, maintainers regenerate the SDKs with:

```bash
make fix
```

Consumers use the generated clients; generated files are not edited by hand. [The upstream package manifest](https://github.com/gomodedev/gomode/blob/main/package.json) is the source of truth for exports and peer dependencies.
