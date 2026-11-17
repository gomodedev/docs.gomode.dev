# Troubleshooting

Start with the failing boundary: service reachability, discovery, identity, or voice transport.

## The hosted page does not load

Open the same service URL on the phone’s browser. Check DNS, HTTPS, network access, and the host process. `localhost` on Android points to the phone. A development host must be reachable through a network address or port forwarding.

For local project tests, use the repository’s runner rather than manually recreating its forwarding:

```bash
make android-e2e
```

## The page loads but native features are disabled

Fetch the public manifest:

```bash
curl -fsS https://your-host.example/.well-known/gomode.json
```

Check `apiVersion`, `webShell.bridgeVersion`, the tool-group endpoint, and the gateway metadata. Native features require a compatible manifest; a normal HTML page alone is not a Go Mode host.

`webShell.bridgeVersion` must be `3`. If the manifest is compatible, check whether the frontend sent a settled [authentication signal](./authentication) and marked its scope ready with `setTools` and `setDataReady`. Unknown identity stays paused. Do not bypass that state by setting `nativeAccess: true` before checking the session.

## Tools fail after login or account switching

Confirm that the host sends `authChanging` before changing credentials and `authChanged` after validating the new identity. Bearer hosts must replace or clear the in-memory bearer too.

Check authorization at the MCP endpoint. Discovery being public does not make tools public. A 401 or 403 should be resolved through the host’s login and policy, not by weakening client checks.

## Provider login fails in Android

Some providers prohibit embedded login. Test the actual WebView flow; a working desktop flow is insufficient. External-browser login handoff is not implemented in the current shell.

## Voice connects but there is no audio

Check microphone permission, selected audio route, device volume, and the gateway’s reachable UDP port. Verify the gateway backend and its credentials or local runtime. HTTPS signaling can succeed while WebRTC media fails.

For Local or Browser recognition and speech, check the platform’s recognition and synthesis support. Select the gateway’s recognition or speech models when the platform’s service is unavailable.

A microphone that is denied or blocked shows a problem in the voice bar with a way to open app settings. Check that the microphone button is not set to **Muted**.

## Voice audio stays on the phone speaker

Native voice prefers a Bluetooth device when Voice connects, if one is already available. Open the voice panel and select another audio route when the sound stayed on the phone. Confirm the device is connected as a call or communication device, which is what Android routes voice through. Browser speech follows the operating system route instead of the WebRTC device list.

## A local voice model does not load

A gateway’s local stack downloads its models on first use; the voice progress names the current step. For a model on the phone, check in Settings that the selected model is downloaded; a missing model shows **Not downloaded**. Expand **Model load diagnostics** to see which load stage failed and how much memory it used. A load that ended the app shows Android’s exit reason, such as **Low memory**. End the voice session before changing the model.

## Gateway voice choices do not appear

Check the discovery manifest’s gateway URL, then read the choices endpoint directly:

```bash
curl -fsS https://your-gateway.example/api/voicegateway/v2/voice/choices
```

Go Mode shows the gateway’s error text with a retry action. The usual causes are a gateway that is not running or a provider whose credentials are missing; the standalone gateway hides those choices at startup and logs a warning. Check the gateway log. A language model appears under **Separate stages** only when it serves the selected stages: `text` when the client owns both recognition and speech, and `webrtc` otherwise.

## A saved voice choice or speaking voice changed

When the gateway stops offering a saved choice, model, or speaking voice, new sessions use the gateway’s default and Settings shows it. A session that reconnects after the change fails with **Start a new voice session**. Keep each entry’s `id` stable in `voice-choices.toml` so tuning a model keeps the users’ selections.

A speaking voice of another language than the voice language does not appear; change the voice language first.

## Voice cannot reach a service

Voice reaches only the service on screen. Switch to it with **Next server** or ask the assistant to switch. Voice lists the saved services that finished discovery. A service with a failed connection or an incompatible manifest is not callable until its connection succeeds, and the Services list shows its readiness and a retry action.

## A service or voice drops after a network change

A cold start or a Wi-Fi to cellular handover can interrupt discovery. On network failures and HTTP 408, 429, and 5xx answers, Android retries the manifest fetch with backoff of up to 30 seconds, and the service card shows **Reconnecting**. Authentication, parse, and compatibility failures do not retry; reload the page or use the retry action.

Android voice keeps the conversation while it reconnects for up to two minutes after the first loss. Gateway 401, 403, and 404 answers end the call. Check the gateway’s authorization and route when a call ends instead of recovering.

## Notifications do not arrive

Check Android notification permission and the active service identity. Confirm the host publishes unexpired alerts through `gomode://notifications` and signals resource updates. Alerts already in the first snapshot after startup do not sound; only later additions do. The shell does not invent alerts from product status. Alerts for the service visible on screen are suppressed, and shared voice suppresses alerts for every participant.

## Tapping an alert opens nothing

Go Mode opens only HTTP(S) destinations on the origin of the saved service that owns the alert. A destination on another host, a non-HTTP scheme, or a value that resolves outside that origin is dropped, so the alert still appears and tapping it opens Go Mode without navigating to the host page. Check the host’s `url` value and that the saved service URL matches the destination’s origin.

## A car dial starts a cellular call

Check **Dial from your car** in Settings: it reports whether Go Mode holds Android’s call-redirection role. Select Go Mode again if another app took the role. Microphone permission must be granted, and the phone must have been unlocked once since boot. Go Mode intercepts only the exact contact numbers it created; dial them without extra digits.

## Capture or emulator development

The upstream Makefile provides emulator startup, shell e2e, and screenshot targets. Documentation screenshots show real native screens and the caic and mddb browser frontends with sample data. They do not prove physical Halo pairing or live cloud-model connectivity.

[Android setup](./android), [host integration](./host), and [voice gateway](./voice) cover the corresponding setup steps.
