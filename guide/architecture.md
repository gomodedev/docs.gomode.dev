# Architecture

Go Mode separates the native shell, the host application, and the voice gateway. Each has one owner for its data and behavior.

| Component                   | Owns                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| Host                        | Accounts, authorization, frontend, product APIs, MCP tools and resources                           |
| Android shell               | Service bootstrap, WebView, microphone, audio routing, native voice, settings, notifications, Halo |
| Browser integration         | Host-mode detection, browser MCP client, voice controls, notification integration                  |
| Voice gateway               | Signaling, media, conversation turns, backend transport, local model orchestration                 |
| Shared Go packages and SDKs | Discovery, OAuth and MCP transports, typed protocol contracts                                      |

## Bootstrap and native access

The shell loads the frontend and fetches `/.well-known/gomode.json` outside the WebView’s critical path. It checks discovery and bridge versions before enabling native features.

An unavailable or incompatible manifest does not turn a hosted page into a compatible service. Native features remain disabled with a visible status. Authentication remains the host’s responsibility.

After a confirmed login signal, native MCP and voice requests use the active host identity. Leaving the trusted origin or changing identity stops native access until the host validates it again.

## Voice tool flow

1. The client discovers the host’s tool group and gateway.
2. It lists the MCP tools and reads a bounded service context.
3. It starts a voice or text session with the gateway.
4. The gateway requests a tool call.
5. The client executes it through the host’s MCP endpoint and returns the result.

The gateway does not call the host’s MCP endpoint itself and does not own service-item state. The host authorizes each action.

## Package boundaries

The root Go package is small: discovery and voice-token contracts. Heavy media and model dependencies stay under `voicegateway`. A host that only needs discovery does not import the entire voice stack.

The Android shell has no caic task SDK dependency or hard-coded task route. caic’s task list, details, diffs, and widgets stay in its hosted web frontend. Other hosts can expose different products through the same shell.

See [the server library guide](https://github.com/maruel/gomode/blob/main/docs/SERVER_LIBRARY.md) for dependency rules and [the Android guide](https://github.com/maruel/gomode/blob/main/docs/ANDROID_SHELL.md) for native contract details.
