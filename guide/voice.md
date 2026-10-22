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

## Voice choices

One gateway URL can offer several named choices. Clients list them, filter them by speech mode, and save the user’s selection. A choice is the only thing a client selects; it never names a provider.

Config lists the choices under `[[choices]]` and names the default with `default_choice_id`. When `default_choice_id` is unset, the first configured choice is the default.

```toml
default_choice_id = "gemini"

[[choices]]
id = "gemini"
label = "Gemini Live"
backend = "gemini-live"
model = "gemini-3.8-live"

[[choices]]
id = "remote"
label = "Remote LLM"
backend = "local-stack"

[choices.local_stack]
text_only = true
```

Keep choice IDs stable, because clients save the selected ID per gateway URL. A client passes its choice as `choiceID` with an offer or a text request and omits it to accept the default. An unknown choice or a transport the choice does not serve fails before a session starts.

`GET /api/voicegateway/v1/voice/choices` returns the public metadata clients need. Each choice carries an `id`, a `label`, and its `transports`, and the response names its `defaultChoiceID`. A `webrtc` transport means the gateway handles audio. A `text` transport means the client handles speech and sends text. Audio choices that support voice selection also advertise a `voices` catalog and a `defaultVoice`. Discovery carries no credentials and no model endpoint addresses.

A `local-stack` choice with `text_only = true` serves text sessions only, so it appears only in client-speech modes and the gateway starts no speech recognition or synthesis for it.

Clients save the choice per gateway URL and the speaking voice per gateway and choice. Every new session pins both. When a saved choice or speaking voice disappears, connecting is blocked until the user selects an available one, while active sessions keep the values they already resolved.

## Backend choices

A choice names one backend and its model:

- **`gemini-live`:** a cloud audio backend with full-duplex conversation. It reads `GEMINI_API_KEY`. Its choices advertise their speaking voices, with `Orus` as the default until the user picks another.
- **`local-stack`:** ASR, a language model, and TTS, with managed local components or configured remote services. It also supports text sessions, and `text_only = true` reduces it to the text side.

Because clients select a choice, changing a backend or its model is a gateway configuration change that clients pick up from discovery. For detailed engine configuration and platform requirements, use [the upstream local-stack guide](https://github.com/maruel/gomode/blob/main/docs/VOICE_LOCAL_STACK.md).

## Audio and text modes

Cloud audio uses WebRTC with Opus audio and the `voice-gateway` data channel. Android **On-device** speech uses Android recognition and synthesis, connected to the gateway’s text WebSocket.

The browser integration offers **Cloud voice** and **Browser speech**. Browser speech availability depends on the browser; its recognition may use the browser vendor’s service. Text sessions require a text-capable gateway such as `local-stack`.

Client speech modes ask discovery for `text` choices and Cloud voice asks for `webrtc` choices. [Android setup](./android) covers the speech modes and their settings.

Device speech through the **Remote LLM** engine and browser speech still use the gateway’s language model. They are not an offline guarantee.

## API credentials

The gateway never reads credentials from its config file. The Linux user service reads `~/.config/systemd/user/voice-gateway.env` through `EnvironmentFile`. This file is optional for local-only deployments.

Install the template, then edit it and uncomment the keys your choices need:

```sh
install -d -m 700 ~/.config/systemd/user
install -m 600 contrib/voice-gateway.env.example ~/.config/systemd/user/voice-gateway.env
systemctl --user restart voice-gateway.service
```

- Gemini Live reads `GEMINI_API_KEY`.
- The native `deepseek` language-model provider reads `DEEPSEEK_API_KEY`; leave `api_key_name` unset for that provider.
- An `openaicompatible` language-model endpoint reads the variable named by its `api_key_name`.

Use `NAME=value` assignments without `export` or shell substitutions, and keep real keys in this private file instead of the unit or the config. A systemd user service does not inherit exports from your interactive shell. Restart the service after editing the file.

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
