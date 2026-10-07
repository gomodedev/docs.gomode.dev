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

## Notifications do not arrive

Check Android notification permission and the active service identity. Confirm the host publishes unexpired events through `gomode://notifications` and signals resource updates. The shell does not invent alerts from product status.

## Capture or emulator development

The upstream Makefile provides emulator startup, shell e2e, and voice fixture targets. Documentation screenshots show real native screens and a generic demonstration host; they do not prove physical Halo pairing or live cloud-model connectivity.

[Android setup](./android), [host integration](./host), and [voice gateway](./voice) cover the corresponding setup steps.
