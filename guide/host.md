# Host integration

A Go Mode host serves a web frontend and a public discovery manifest. It owns authentication, product APIs, MCP tool semantics, and the content clients see.

## Serve discovery

Add the Go module:

```bash
go get github.com/maruel/gomode
```

Mount the handler on your existing HTTP server:

```go
settings := &gomode.Settings{
    Service:    "my-service",
    APIVersion: 1,
    WebShell: gomode.WebShellSettings{
        BridgeVersion: 3,
        ToolGroups:    []gomode.ToolGroup{},
        VoiceGateway:  gomode.VoiceGatewaySettings{Required: false},
    },
}
handler, err := gomode.NewHandler(settings)
if err != nil {
    return err
}
mux.Handle("GET /.well-known/gomode.json", handler)
```

Import `github.com/maruel/gomode` and `net/http` in your server. This minimal manifest permits discovery; it advertises no tools or voice gateway. `toolGroups` must be a JSON array, including when empty.

The discovery handler validates the settings once, serves precomputed JSON, and supports ETag revalidation. Keep the route public: it describes compatibility, not a user’s private data.

## Advertise native capabilities

| Field                    | What it tells clients                                        |
| ------------------------ | ------------------------------------------------------------ |
| `service`                | Stable product identity                                      |
| `serviceVersion`         | Optional host version for diagnostics                        |
| `apiVersion`             | Discovery schema version                                     |
| `webShell.bridgeVersion` | Native/browser bridge version                                |
| `webShell.toolGroups`    | MCP endpoints and their protocol versions                    |
| `webShell.voiceGateway`  | Gateway URL, requirement, authentication, and token endpoint |

Use `apiVersion` 1 and `bridgeVersion` 3. Bridge version 3 adds document-bound [authentication](./authentication) and frontend preparation. Clients reject unsupported versions rather than silently enabling incompatible native features.

MCP endpoint and gateway references accept an absolute HTTP(S) URL or an absolute path on the service origin. They do not accept relative paths such as `api/mcp`.

## Add tools and voice

1. Implement an authenticated [MCP endpoint and resource projection](./skills).
2. Advertise the endpoint as a tool group with its actual supported protocol version.
3. Report settled login state and frontend readiness through the [authentication bridge](./authentication).
4. Mount an embedded gateway or configure a [standalone voice gateway](./voice).
5. Open the host in the Android shell and verify discovery, login, tools, and logout.

The shell uses each service’s first tool group. Do not rely on progressive skill activation or multiple-group tool selection.

## Offer voice choices

A gateway can offer several named voice choices at one URL. The shell lists the choices your gateway advertises, filters them by transport, and saves the user’s choice and speaking voice for that gateway.

Each choice carries an ID, a label, and the transports it serves. An audio choice that supports voice selection also lists its speaking voices. A text-only choice appears only where the client handles speech. See [voice gateway](./voice) for the configuration.

The choices come from `GET /api/voicegateway/v2/voice/choices` on the gateway. Mount the gateway with Go Mode’s handler, or run it as a service, and this endpoint needs no extra host code.

## Publish resource updates

Implement `mcp.SubscriptionRegistry` to signal resource changes. For released Streamable HTTP clients, create one `mcp.NewSessionStore` for the server lifetime and set it on `mcp.Handler.Sessions`. Its owner function returns a stable key for the authenticated principal, never a credential. Authenticate every request; a session ID grants nothing. Updates are invalidations: clients read the resource again. The [`mcp` package documentation](https://pkg.go.dev/github.com/maruel/gomode/mcp) covers the session lifecycle.

## Alerts

Expose `gomode://notifications` as an authoritative snapshot of the alerts that are actionable now. During voice, a new alert also reaches the assistant. The [MCP and skills](./skills) page defines the fields, destination rules, reconciliation, and expiry; routing and retention stay in your host.

## Keep your frontend

The Android shell loads your frontend in a WebView. Product routes stay in your application. Native voice and notification controls complement the hosted UI; use [browser integration](./sdk) to avoid showing duplicate browser controls inside the shell.

A real adapter example is [caic’s server](https://github.com/caic-xyz/caic/tree/main/backend/internal/server). The [Go package documentation](https://pkg.go.dev/github.com/maruel/gomode) holds the reusable contracts.
