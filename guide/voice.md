# Voice gateway

Go Mode’s gateway connects clients to a voice backend through one service-neutral contract. It handles conversation and media transport; clients execute host tools through MCP.

## Choose a deployment

| Mode       | Use it when                                                       | Authentication                 |
| ---------- | ----------------------------------------------------------------- | ------------------------------ |
| Embedded   | Voice runs with the host process                                  | Host session policy            |
| Standalone | Voice needs a separate machine, scaling, or local model isolation | Short-lived host-issued tokens |

Embedded hosts mount `voicegateway.NewEmbeddedHandler` and advertise the gateway URL in discovery. An external gateway runs `cmd/voice-gateway` and accepts only configured trusted issuers.

Build the standalone binary from the repository:

```bash
go build -o voice-gateway ./cmd/voice-gateway
./voice-gateway -config /path/to/config.toml
```

Start from [contrib/config.toml](https://github.com/maruel/gomode/blob/main/contrib/config.toml). Replace the example trusted issuer before accepting clients.

## Backend choices

- **`gemini-live`:** a cloud audio backend with full-duplex conversation. Supply the configured provider credentials.
- **`local-stack`:** ASR, a language model, and TTS, with managed local components or configured remote services. It also supports text sessions.

Clients choose a gateway URL; they do not branch on a provider name. For detailed engine configuration and platform requirements, use [the upstream local-stack guide](https://github.com/maruel/gomode/blob/main/docs/VOICE_LOCAL_STACK.md).

## Audio and text modes

Cloud audio uses WebRTC with Opus audio and the `voice-gateway` data channel. Android **On-device** speech uses Android recognition and synthesis, connected to the gateway’s text WebSocket.

The browser integration offers **Cloud voice** and **Browser speech**. Browser speech availability depends on the browser; its recognition may use the browser vendor’s service. Text sessions require a text-capable gateway such as `local-stack`.

Device speech and browser speech still use the gateway’s language model. They are not an offline guarantee.

## External gateway authentication

The host authenticates the user and issues an audience-scoped, short-lived token. The gateway verifies a configured trusted issuer, then binds the session to the host service, instance, origin, and subject.

A trusted OAuth issuer entry looks like:

```toml
[[trusted_issuers]]
service = "my-service"
issuer = "https://app.example.com"
oauth = true
```

Advertise the external URL and `tokenEndpoint` in `webShell.voiceGateway`. The host endpoint issues tokens on demand. Diagnostics and close require fresh credentials for the same identity.

Browsers redeem single-use text-session tickets through an authenticated HTTP endpoint before opening the text WebSocket. Tickets stay out of URLs and persistent storage. The [gateway guide](https://github.com/maruel/gomode/blob/main/docs/VOICE_GATEWAY.md#text-sessions) defines the exact routes and contract.

## Network requirements

Put HTTPS in front of signaling, and make the gateway’s WebRTC UDP port reachable. The standalone gateway can request a UPnP mapping, but that does not solve blocked UDP or every NAT topology. A successful HTTP request does not prove the audio path can connect.

For a user service, adapt [voice-gateway.service](https://github.com/maruel/gomode/blob/main/contrib/voice-gateway.service). Set the trusted issuer and config path, and keep needed runtime binaries on the service’s `PATH`.

Protocol details and configuration remain in [VOICE_GATEWAY.md](https://github.com/maruel/gomode/blob/main/docs/VOICE_GATEWAY.md) and [the generated API reference](https://github.com/maruel/gomode/blob/main/sdk/voicegateway/API.md).
