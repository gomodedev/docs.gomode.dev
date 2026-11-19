# Voice gateway

Go Mode’s gateway connects clients to a voice backend through one service-neutral contract. It handles conversation and media transport; clients execute host tools through MCP.

The voice gateway supports Windows, macOS, and Linux. Clients connect from the web or the native Android app.

## Choose a deployment

| Mode       | Use it when                                                       | Authentication                 |
| ---------- | ----------------------------------------------------------------- | ------------------------------ |
| Embedded   | Voice runs with the host process                                  | Host session policy            |
| Standalone | Voice needs a separate machine, scaling, or local model isolation | Short-lived host-issued tokens |

Embedded hosts mount `voicegateway.NewEmbeddedHandler` and advertise the gateway URL in discovery. `voicegateway.ReadConfig` reads `voice-choices.toml` from the host’s configuration directory, with the same entries as the standalone gateway. The host embeds `voicegateway.WebRTCConfig` in its own TOML file for the UDP port and STUN servers. The [`Config` documentation](https://pkg.go.dev/github.com/gomodedev/gomode/voicegateway#Config) lists the startup calls. An external gateway runs `voice-gateway` and accepts only configured trusted issuers.

## Install the standalone gateway

The installers download the latest stable release for Linux, macOS, or Windows on amd64 or arm64, verify its checksum, keep existing configuration and credentials, and start a user service. Run the same command again to update.

Linux or macOS:

```sh
curl -fsSL https://raw.githubusercontent.com/gomodedev/gomode/main/contrib/install.sh -o /tmp/install-voice-gateway.sh
bash /tmp/install-voice-gateway.sh
```

Windows PowerShell:

```powershell
Invoke-WebRequest -UseBasicParsing https://raw.githubusercontent.com/gomodedev/gomode/main/contrib/install.ps1 -OutFile "$env:TEMP\install-voice-gateway.ps1"
& "$env:TEMP\install-voice-gateway.ps1"
```

| Setting          | Linux                                        | macOS                                     | Windows                               |
| ---------------- | -------------------------------------------- | ----------------------------------------- | ------------------------------------- |
| Binary directory | `~/.local/bin`                               | `~/.local/bin`                            | `%LOCALAPPDATA%\voice-gateway`        |
| Credentials file | `~/.config/systemd/user/voice-gateway.env`   | Beside the configuration                  | Beside the executable                 |
| Service          | systemd user `voice-gateway.service`         | launchd user `com.fghbuild.voice-gateway` | Scheduled task `GoModeVoiceGateway`   |
| Logs             | `journalctl --user -u voice-gateway.service` | `~/Library/Logs/voice-gateway.log`        | `voice-gateway.log` beside executable |

The configuration is `~/.config/voice-gateway/config.toml`, or under `XDG_CONFIG_HOME` when set. Start from [contrib/config.toml](https://github.com/gomodedev/gomode/blob/main/contrib/config.toml). Replace the example trusted issuer before accepting clients. The gateway restarts when `config.toml` or `voice-choices.toml` changes.

Released binaries check for a new stable release every day at 04:50 local time and restart after active sessions drain. Set `auto_update` to another cron schedule, or to an empty string to disable updates.

To build from source instead:

```sh
go install github.com/gomodedev/gomode/cmd/voice-gateway@latest
voice-gateway -config ~/.config/voice-gateway/config.toml
```

## Voice choices

One gateway URL offers several named choices. Clients list them, filter them by transport, and save the user’s selection. A choice is the only thing a client selects; it never names a provider.

The release embeds [default choices](https://github.com/gomodedev/gomode/blob/main/voicegateway/voice-choices.toml) for Gemini, OpenAI, Anthropic, DeepSeek, OpenRouter, Mistral, Alibaba, and local models. To customize them, copy that file to `voice-choices.toml` beside `config.toml`. The copy replaces the defaults entirely and no longer follows later releases. Voice tables in `config.toml` stop startup.

The file declares choices in three groups, offered in this order:

- **`[[realtime]]`:** a speech-to-speech model that owns recognition, conversation, and synthesis.
- **`[[llm]]`:** a language model with recognition and synthesis selected separately, either on the gateway or on the client.
- **`[[voice]]`:** a preset that combines one `[[asr]]` recognition stage, one `[[llm]]`, and one `[[tts]]` synthesis stage by `id`.

```toml
[[realtime]]
id = "gemini-live"
label = "Gemini Live"
provider = "gemini"
model = "gemini-3.8-live"

[[llm]]
id = "gemini-flash"
label = "Gemini Flash"
provider = "gemini"
model = "gemini-3.8-flash"
effort = "low"

[[asr]]
id = "gemini-transcribe-live"
label = "Gemini Transcribe"
provider = "gemini"
model = "gemini-3.5-transcribe-live"

[[tts]]
id = "gemini-tts"
label = "Gemini Flash Lite TTS"
provider = "gemini"
model = "gemini-3.8-flash-lite-tts"
voice = "Kore"

[[voice]]
id = "gemini-speech-flash"
label = "Gemini speech with Gemini Flash"
asr = "gemini-transcribe-live"
llm = "gemini-flash"
tts = "gemini-tts"
```

Every entry needs an `id`: 1 to 64 lowercase letters, digits, `-`, or `_`, starting with a letter or digit. Clients save ids, so keep an entry’s id when you tune its other settings. Ids are unique among `[[realtime]]`, `[[llm]]`, and `[[voice]]` together, among `[[asr]]`, and among `[[tts]]`.

`provider` names a [genai](https://github.com/maruel/genai) provider, such as `gemini`, `openai`, `anthropic`, `deepseek`, `openrouter`, `mistral`, `alibaba`, or `llamacpp`. `effort` requests a reasoning level from `off` to `max` where the model supports it. A `llamacpp` entry with `llamacppsrv = true` downloads and runs a managed llama.cpp server and requires `context_size`; `remote` points to a server you run. `provider = "openai"` with `auth = "codex"` uses the gateway user’s Codex login instead of an API key.

At startup, the standalone gateway hides choices whose provider is unavailable and logs a warning. An empty catalog stops startup.

Local models load on first use, and voice progress names the current startup step, such as a model download. `[local_stack_runtime]` sets how long an idle choice stays loaded and how many choices run at once. Active sessions keep their choice loaded; another choice waits when every slot is busy. A choice keeps loading after the session that started it ends, so a reconnecting client does not restart the load; with no session left, it counts as idle once loaded, and another choice that needs its slot cancels the load.

### Discovery

`GET /api/voicegateway/v2/voice/choices` returns the public metadata clients need. Each choice carries an `id`, a `label`, and its `transports`. A `webrtc` transport means the gateway handles audio. A `text` transport means the client handles speech and sends text. Audio choices that support voice selection also list their speaking `voices`. `defaults` names one default choice per transport. Discovery carries no credentials and no model endpoint addresses.

Discovery also lists the gateway’s recognition and synthesis models, and its `stunServers` for WebRTC clients. A speaking voice carries an optional language; clients offer the voices without one and those of the session language.

Clients save the choice, the stage models, and the speaking voice per gateway. Every new session pins them. When the gateway withdraws a saved entry, clients use the default instead: the advertised default choice, the first listed model, or the provider’s voice. Settings show what a session will use, and the next edit saves it. A recovering session that lost a pinned entry fails and asks for a new session.

### Speech stages

Each recognition stage opens a live transcription session per utterance; models that support it show draft text while you speak. Recognition uses a genai provider with live transcription, such as `gemini`, `llamacpp`, `mistral`, or `openai`, or a local engine:

| Engine       | Models                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------- |
| `nemospeech` | NVIDIA `parakeet-tdt`, `nemotron-3.5`, and the English-only `nemotron-en` and `parakeet-ctc` |
| `whistle`    | Cactus Whistle                                                                               |

Synthesis uses a genai provider, such as Gemini TTS or llama.cpp, or `engine = "kittentts"` with Kitten TTS 2 1.7B or its 82M mini model.

Every stage follows the session language: models that take a language receive it, and others ignore it. A model that declares its languages rejects another one at session setup; other recognizers reject it when the utterance starts. Each KittenTTS voice speaks one language, so a session in another language uses that language’s first voice.

A fully local stack needs only stages without a provider API key. Managed engines download their release and models on first use; omit `remote` for a managed server, or set `remote` to the origin of a server you run. For single-model audio instead of separate stages, use an LFM3 `[[realtime]]` choice; `staged = true` adds a text step for thinking and tool calls before LFM3 speaks. The [default choices](https://github.com/gomodedev/gomode/blob/main/voicegateway/voice-choices.toml) hold complete examples.

## Audio and text modes

Android and the browser integration share one voice setup. **All-in-one** selects a realtime choice. **Separate stages** selects recognition, a language model, and speech; each speech stage runs on the gateway or on the client. Client speech is Android recognition and text to speech, or the browser’s speech APIs, whose recognition may use the browser vendor’s service.

A session uses WebRTC with Opus audio and the `voice-gateway` data channel. When the client owns both recognition and speech, it connects to the gateway’s text WebSocket instead. Discovery marks the matching choices with the `webrtc` and `text` transports. [Android setup](./android) covers the settings.

Client speech with a gateway language model is not an offline guarantee.

The gateway owns the common voice instructions: tone, quiet context updates, isolation between services, and the reply language. Hosts supply only their MCP server instructions.

## API credentials

The gateway never reads credentials from its config file. Install the [credentials template](https://github.com/gomodedev/gomode/blob/main/contrib/voice-gateway.env.example) at the credentials file path, then uncomment the keys your choices need. Each provider reads genai’s environment variable, such as `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `ANTHROPIC_API_KEY`. `LLAMA_API_KEY` and `OLLAMA_API_KEY` are optional; when set, the gateway sends them to llama.cpp or Ollama, and a managed llama.cpp server enforces `LLAMA_API_KEY`. An `openaicompatible` endpoint reads the variable named by its `api_key_name`.

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

`stun_servers` lists the STUN servers clients use to learn their public address, Google’s public server by default. Set it to `[]` when clients reach the UDP port directly or through UPnP; clients then contact no STUN server.

The `[server]` section controls exposure:

- `external_url` sets the expected public origin.
- `trusted_proxies` lists the peers allowed to supply forwarded client addresses.
- `allow_origins` rejects clients outside the listed networks, such as `local`, `tailscale`, CIDRs, or country codes with a `geo_db`.
- `debug_frontend` serves a test page and unauthenticated test routes. Anyone who reaches it can use your voice backends; keep it off on shared networks.

Clients recover voice and service connections after a network change without starting a new conversation.

Protocol details remain in [the generated v2 API reference](https://github.com/gomodedev/gomode/blob/main/sdk/voicegateway/API.v2.md) and [the gateway HTTP handlers](https://github.com/gomodedev/gomode/blob/main/voicegateway/http.go).
