# Android setup

Go Mode loads a compatible service’s existing web frontend and adds native voice, notifications, settings, and optional Halo glasses integration.

## Build from source

The supported setup here builds the Android app from [the Go Mode repository](https://github.com/maruel/gomode). Go Mode is a library and Android app; there is no `gomode` coding-agent CLI to install.

```bash
git clone https://github.com/maruel/gomode.git
cd gomode
make android-sdk
make android-push
```

`make android-sdk` checks or installs the SDK packages required by the project. `make android-push` runs Android checks, builds the app, and installs and launches it on the connected device. Enable USB debugging and authorize the device first; check it with `adb devices`.

For an emulator:

```bash
make android-start-emulator
make android-push
```

To build without installation:

```bash
make android-check
```

The debug application ID is `com.fghbuild.gomode`. Build targets and prerequisites are maintained in the [upstream Makefile](https://github.com/maruel/gomode/blob/main/Makefile).

## Add your service

1. Open **Settings** and add a connection.
2. Enter the host’s **Server URL**, including `https://` or `http://`. Use HTTPS for deployed hosts; HTTP is supported for reachable local development services.
3. Save the connection and select it.
4. Sign in through the host’s frontend when required.

The service URL must be reachable from the phone. A phone’s `localhost` means the phone, not your development machine. Use a reachable address or a private network such as Tailscale. Android emulator access to a host machine commonly uses `10.0.2.2`; for local instrumented tests, the project runner configures `adb reverse`.

<div class="native-gallery">
<figure><img src="/screenshots/connections.webp" width="1080" height="2400" alt="Native service connections screen" loading="lazy"><figcaption>Saved service connections</figcaption></figure>
<figure><img src="/screenshots/service-editor.webp" width="1080" height="2400" alt="Native Go Mode connection editor" loading="lazy"><figcaption>Add or edit a service URL</figcaption></figure>
</div>

## Choose how you speak

In native Settings, select **Cloud voice** or **On-device voice** and a voice language. Mode and language are locked during an active or connecting voice session.

- **Cloud voice:** microphone and assistant audio travel over WebRTC to the gateway.
- **On-device voice:** Android handles recognition and speech synthesis; the gateway still supplies the language model and tool conversation.

On-device voice requires a text-capable gateway such as `local-stack`. On-device speech does not mean the whole conversation works offline. Recognition availability and processing depend on Android and the installed speech service. Both modes need a compatible host and gateway.

<img class="native-capture" src="/screenshots/voice-settings.webp" width="1080" height="2400" alt="Native voice mode and language settings" loading="lazy">

## Notifications and Halo

Allow notification permission when you want host alerts and background monitoring. The host publishes notification facts through MCP; Go Mode handles native delivery.

Halo settings connect optional Brilliant Labs Halo glasses. The emulator capture shows configuration, not a verified physical-device connection.

<img class="native-capture" src="/screenshots/halo.webp" width="1080" height="2400" alt="Native Halo glasses configuration" loading="lazy">

See [Troubleshooting](./troubleshooting) when the hosted page loads but native features remain unavailable.
