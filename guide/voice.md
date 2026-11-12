# Voice gateway

Go Mode’s gateway connects clients to a voice backend through one service-neutral contract. It handles conversation and media transport; clients execute host tools through MCP.

## Choose a deployment

| Mode       | Use it when                                                       | Authentication                 |
| ---------- | ----------------------------------------------------------------- | ------------------------------ |
| Embedded   | Voice runs with the host process                                  | Host session policy            |
| Standalone | Voice needs a separate machine, scaling, or local model isolation | Short-lived host-issued tokens |

Embedded hosts mount `voicegateway.NewEmbeddedHandler` and advertise the gateway URL in discovery. Embed `voicegateway.Config` under a section of the host’s TOML file; the same `[[realtime]]`, `[[llm]]`, `[[asr]]`, `[[tts]]`, and `[[voice]]` entries apply. The [`Config` documentation](https://pkg.go.dev/github.com/maruel/gomode/voicegateway#Config) lists the startup calls. An external gateway runs `voice-gateway` and accepts only configured trusted issuers.

## Install the standalone gateway

The installers download the latest stable release for Linux, macOS, or Windows on amd64 or arm64, verify its checksum, keep existing configuration and credentials, and start a user service. Run the same command again to update.

Linux or macOS:

```sh
curl -fsSL https://raw.githubusercontent.com/maruel/gomode/main/contrib/install.sh -o /tmp/install-voice-gateway.sh
bash /tmp/install-voice-gateway.sh
```

Windows PowerShell:

```powershell
Invoke-WebRequest -UseBasicParsing https://raw.githubusercontent.com/maruel/gomode/main/contrib/install.ps1 -OutFile "$env:TEMP\install-voice-gateway.ps1"
& "$env:TEMP\install-voice-gateway.ps1"
```

| Setting          | Linux                                        | macOS                                   | Windows                               |
| ---------------- | -------------------------------------------- | --------------------------------------- | ------------------------------------- |
| Binary directory | `~/.local/bin`                               | `~/.local/bin`                          | `%LOCALAPPDATA%\voice-gateway`        |
| Credentials file | `~/.config/systemd/user/voice-gateway.env`   | Beside the configuration                | Beside the executable                 |
| Service          | systemd user `voice-gateway.service`         | launchd user `com.maruel.voice-gateway` | Scheduled task `GoModeVoiceGateway`   |
| Logs             | `journalctl --user -u voice-gateway.service` | `~/Library/Logs/voice-gateway.log`      | `voice-gateway.log` beside executable |

The configuration is `~/.config/voice-gateway/config.toml`, or under `XDG_CONFIG_HOME` when set. Start from [contrib/config.toml](https://github.com/maruel/gomode/blob/main/contrib/config.toml). Replace the example trusted issuer before accepting clients.

Released binaries check for a new stable release every day at 04:50 local time and restart after active sessions drain. Set `auto_update` to another cron schedule, or to an empty string to disable updates.

To build from source instead:

```sh
go install github.com/maruel/gomode/cmd/voice-gateway@latest
voice-gateway -config ~/.config/voice-gateway/config.toml
```

## Voice choices

One gateway URL offers several named choices. Clients list them, filter them by transport, and save the user’s selection. A choice is the only thing a client selects; it never names a provider.

The configuration declares choices in three groups, offered in this order:

- **`[[realtime]]`:** a speech-to-speech model that owns recognition, conversation, and synthesis.
- **`[[llm]]`:** a language model with recognition and synthesis selected separately, either on the gateway or on the client.
- **`[[voice]]`:** a preset that combines one `[[asr]]` recognition stage, one `[[llm]]`, and one `[[tts]]` synthesis stage by `id`.

```toml
[[realtime]]
label = "Gemini Live"
provider = "gemini"
model = "gemini-3.8-live"

[[llm]]
id = "gemini_flash"
label = "Gemini Flash"
provider = "gemini"
model = "gemini-3.8-flash"
effort = "low"

[[asr]]
id = "whisper"
label = "Groq Whisper"
provider = "groq"
model = "whisper-large-v3-turbo"

[[tts]]
id = "gemini"
label = "Gemini TTS"
provider = "gemini"
model = "gemini-3.8-flash-lite-tts"
voice = "Kore"

[[voice]]
label = "Groq Whisper with Gemini Flash"
asr = "whisper"
llm = "gemini_flash"
tts = "gemini"
```

`provider` names a [genai](https://github.com/maruel/genai) provider, such as `gemini`, `openai`, `anthropic`, `deepseek`, `openrouter`, `mistral`, `groq`, or `llamacpp`. `effort` requests a reasoning level from `off` to `max` where the model supports it. A `llamacpp` entry with `llamacppsrv = true` downloads and runs a managed llama.cpp server; `remote` points to a server you run. `provider = "openai"` with `auth = "codex"` uses the gateway user’s Codex login instead of an API key.

At startup, the standalone gateway hides choices whose provider is unavailable and logs a warning. An empty catalog stops startup.

Local models load on first use. `[local_stack_runtime]` sets how long an idle choice stays loaded and how many choices run at once. Active sessions keep their choice loaded; another choice waits when every slot is busy.

### Discovery

`GET /api/voicegateway/v2/voice/choices` returns the public metadata clients need. Each choice carries an `id`, a `label`, and its `transports`. A `webrtc` transport means the gateway handles audio. A `text` transport means the client handles speech and sends text. Audio choices that support voice selection also list their speaking `voices`. `defaults` names one default choice per transport. Discovery carries no credentials and no model endpoint addresses.

The gateway derives each choice ID from its effective settings. Changing a model or its options changes the ID, and a client that saved the old ID asks the user to select again. Labels do not affect IDs.

Clients save the choice per gateway URL and the speaking voice per gateway and choice. Every new session pins both. When a saved choice or speaking voice disappears, connecting is blocked until the user selects an available one, while active sessions keep the values they already resolved.

### Local stages

A fully local stack needs `uv` on the gateway’s `PATH` and stages that need no provider API key. For managed llama.cpp speech, omit `remote`; to use a speech server you run, set `remote` to its origin. A recognition stage with `streaming = true` transcribes while you speak. For single-model audio instead of separate stages, use an LFM3 `[[realtime]]` choice; `staged = true` adds a text step for thinking and tool calls before LFM3 speaks. [contrib/config.toml](https://github.com/maruel/gomode/blob/main/contrib/config.toml) holds complete examples.

## Audio and text modes

Cloud audio uses WebRTC with Opus audio and the `voice-gateway` data channel. Android **On-device** speech uses Android recognition and synthesis, connected to the gateway’s text WebSocket.

The browser integration offers **Cloud voice** and **Browser speech**. Browser speech availability depends on the browser; its recognition may use the browser vendor’s service.

Cloud voice asks discovery for `webrtc` choices and client speech modes ask for `text` choices. [Android setup](./android) covers the speech modes and their settings.

Device speech through the **Remote LLM** engine and browser speech still use the gateway’s language model. They are not an offline guarantee.

The gateway owns the common voice instructions: tone, quiet context updates, isolation between services, and the reply language. Hosts supply only their MCP server instructions.

## API credentials

The gateway never reads credentials from its config file. Install the [credentials template](https://github.com/maruel/gomode/blob/main/contrib/voice-gateway.env.example) at the credentials file path, then uncomment the keys your choices need. Each provider reads genai’s environment variable, such as `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `GROQ_API_KEY`. An `openaicompatible` endpoint reads the variable named by its `api_key_name`.

On Linux:

```sh
install -d -m 700 ~/.config/systemd/user
install -m 600 contrib/voice-gateway.env.example ~/.config/systemd/user/voice-gateway.env
systemctl --user restart voice-gateway.service
```

Use `NAME=value` assignments without `export` or shell substitutions. A user service does not inherit exports from your interactive shell. Restart the service after editing the file. macOS and Windows services pass the file with `-env-file`; its values override inherited variables.

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

Browsers redeem single-use text-session tickets through `POST /api/voicegateway/v2/voice/text/ticket` before opening the text WebSocket. Tickets stay out of URLs and persistent storage.

## Network requirements

Put HTTPS in front of signaling, and make the gateway’s WebRTC UDP port reachable; the example uses UDP 3480. The standalone gateway can request a UPnP mapping, but that does not solve blocked UDP or every NAT topology. A successful HTTP request does not prove the audio path can connect.

The `[server]` section controls exposure:

- `external_url` sets the expected public origin.
- `trusted_proxies` lists the peers allowed to supply forwarded client addresses.
- `allow_origins` rejects clients outside the listed networks, such as `local`, `tailscale`, CIDRs, or country codes with a `geo_db`.
- `debug_frontend` serves a test page and unauthenticated test routes. Anyone who reaches it can use your voice backends; keep it off on shared networks.

Clients recover voice and service connections after a network change without starting a new conversation.

Protocol details remain in [the generated v2 API reference](https://github.com/maruel/gomode/blob/main/sdk/voicegateway/API.v2.md) and [the gateway HTTP handlers](https://github.com/maruel/gomode/blob/main/voicegateway/http.go).
