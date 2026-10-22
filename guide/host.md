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
        BridgeVersion: 1,
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

Use version `1` for the current discovery and bridge contracts. Clients reject unsupported versions rather than silently enabling incompatible native features.

MCP endpoint and gateway references accept an absolute HTTP(S) URL or an absolute path on the service origin. They do not accept relative paths such as `api/mcp`.

## Add tools and voice

1. Implement an authenticated [MCP endpoint and resource projection](./skills).
2. Advertise the endpoint as a tool group with its actual supported protocol version.
3. Report settled login state through the [authentication bridge](./authentication).
4. Mount an embedded gateway or configure a [standalone voice gateway](./voice).
5. Open the host in the Android shell and verify discovery, login, tools, and logout.

The shell currently uses the first tool group. Do not rely on progressive skill activation or multiple-group tool selection.

## Offer voice choices

A gateway can offer several named voice choices at one URL. The shell lists the choices your gateway advertises, filters them by speech mode, and saves the user’s choice and speaking voice for that gateway.

Each choice carries a stable ID, a label, and the transports it serves. An audio choice that supports voice selection also lists its speaking voices, and a text-only choice appears only where the client handles speech. See [voice gateway](./voice) for the configuration and the speaking-voice contract.

The choices come from `GET /api/voicegateway/v1/voice/choices` on the gateway. Mount the gateway with Go Mode’s handler, or run it as a service, and this endpoint needs no extra host code. Keep the IDs stable so saved selections survive configuration changes.

## Alerts

Expose `gomode://notifications` as an authoritative snapshot of the alerts that are actionable now. The [MCP and skills](./skills) page defines the fields, destination rules, reconciliation, and expiry; routing and retention stay in your host.

## Keep your frontend

The Android shell loads your frontend in a WebView. Product routes stay in your application. Native voice and notification controls complement the hosted UI; use [browser integration](./sdk) to avoid showing duplicate browser controls inside the shell.

A real adapter example is [caic’s server](https://github.com/caic-xyz/caic/tree/main/backend/internal/server). The reusable contract is in [Go Mode’s server library guide](https://github.com/maruel/gomode/blob/main/docs/SERVER_LIBRARY.md).
