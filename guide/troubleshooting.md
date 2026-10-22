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

If the manifest is compatible, check whether the frontend sent a settled [authentication signal](./authentication). Unknown identity stays paused. Do not bypass that state by setting `nativeAccess: true` before checking the session.

## Tools fail after login or account switching

Confirm that the host sends `authChanging` before changing credentials and `authChanged` after validating the new identity. Bearer hosts must replace or clear the in-memory bearer too.

Check authorization at the MCP endpoint. Discovery being public does not make tools public. A 401 or 403 should be resolved through the host’s login and policy, not by weakening client checks.

## Provider login fails in Android

Some providers prohibit embedded login. Test the actual WebView flow; a working desktop flow is insufficient. External-browser login handoff is not implemented in the current shell.

## Voice connects but there is no audio

Check microphone permission, selected audio route, device volume, and the gateway’s reachable UDP port. Verify the gateway backend and its credentials or local runtime. HTTPS signaling can succeed while WebRTC media fails.

For On-device or Browser speech, check recognition and synthesis support and that the gateway supports text sessions. Try Cloud voice when the platform’s recognition service is unavailable.

## Voice audio stays on the phone speaker

Native voice prefers a Bluetooth device when Voice connects, if one is already available. Open the voice panel and select another audio route when the sound stayed on the phone. Confirm the device is connected as a call or communication device, which is what Android routes voice through. Browser speech follows the operating system route instead of the WebRTC device list.

## A local voice model does not load

The error names the model Go Mode expected. Install or refresh the weights as described in [Android setup](./android#install-local-model-weights). Weights that are present but rejected point at the model files or the device backends. Check the device log for the backend failure, and end the voice session before changing the model.

## Gateway voice choices do not appear

Check the discovery manifest’s gateway URL, then read the choices endpoint directly:

```bash
curl -fsS https://your-gateway.example/api/voicegateway/v1/voice/choices
```

Go Mode shows the gateway’s error text with a retry action. The usual causes are a gateway that is not running, a gateway whose media bridge is disabled, for example when `GEMINI_API_KEY` is missing, or a backend that failed to initialize and stopped the gateway at startup. A choice also has to serve the transport of the selected speech mode: `webrtc` for Cloud voice and `text` for Remote LLM.

## A saved voice choice or speaking voice is unavailable

Go Mode blocks reconnecting until you select an available choice or speaking voice from Settings; an active session keeps the values it resolved. A saved entry usually disappears when the gateway changed its configuration. Select another entry and reconnect.

## Switching services does not change what voice can reach

Voice lists the saved services that finished discovery. A service with a failed connection or an incompatible manifest is not callable until its connection succeeds, and the Services list shows its readiness and a retry action. Adding a second saved service also makes the Next app control appear.

## Notifications do not arrive

Check Android notification permission and the active service identity. Confirm the host publishes unexpired alerts through `gomode://notifications` and signals resource updates. The shell does not invent alerts from product status. Alerts for the service visible on screen are suppressed, and shared voice suppresses alerts for every participant.

## Tapping an alert opens nothing

Go Mode opens only HTTP(S) destinations on the origin of the saved service that owns the alert. A destination on another host, a non-HTTP scheme, or a value that resolves outside that origin is dropped, so the alert still appears and tapping it opens Go Mode without navigating to the host page. Check the host’s `url` value and that the saved service URL matches the destination’s origin.

## Capture or emulator development

The upstream Makefile provides emulator startup, shell e2e, and voice fixture targets. Documentation screenshots show real native screens and a generic demonstration host; they do not prove physical Halo pairing or live cloud-model connectivity.

[Android setup](./android), [host integration](./host), and [voice gateway](./voice) cover the corresponding setup steps.
