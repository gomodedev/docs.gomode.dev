# Authentication

Your host owns user accounts, login, sessions, and authorization. The Android shell shares the active WebView identity with native MCP and voice features through a narrow origin-bound bridge.

## Report a settled identity

The shell exposes `window.gomodeAuth.postMessage(...)` only to the active service origin and accepts messages from its main frame.

Cookie-backed hosts report the result after checking the identity:

```js
window.gomodeAuth?.postMessage(
  JSON.stringify({
    authChanged: true,
    nativeAccess: true,
  }),
);
```

Set `nativeAccess` to `true` only after confirming the signed-in user, or for a host that requires no authentication. A failed or unknown identity check must not grant native access.

Before logout or account switching:

```js
window.gomodeAuth?.postMessage(JSON.stringify({ authChanging: true }));
```

After the session change settles, send `authChanged` again with the resulting access state. This stops voice and monitoring before credentials change and resumes them only after validation.

## Bearer-backed hosts

Send a validated bearer token through the same bridge:

```js
window.gomodeAuth?.postMessage(JSON.stringify({ bearerToken: token }));
```

Clear it before logout:

```js
window.gomodeAuth?.postMessage(JSON.stringify({ bearerToken: null }));
```

The shell keeps the bearer in memory, not on disk. Do not put tokens in URLs or logs. Native requests pin the identity captured when the voice session starts and reject a changed credential before executing a tool request.

## Authorize at the host

Discovery stays public. MCP tools, resources, and embedded voice routes enforce the host’s policy. An external gateway verifies a short-lived host-issued token; it does not run your login flow or hold your host’s credentials. See [Voice gateway](./voice).

## Provider login limitations

Some identity providers reject embedded WebView login or require browser-only capabilities. The current shell does not implement the external-browser login handoff described in the repository’s design notes. Test your host’s actual login flow on Android; do not assume that desktop login proves WebView compatibility.

The authoritative bridge behavior is in [WebShellScreen.kt](https://github.com/maruel/gomode/blob/main/android/gomode/src/main/java/com/fghbuild/gomode/ui/web/WebShellScreen.kt) and [the Android shell guide](https://github.com/maruel/gomode/blob/main/docs/ANDROID_SHELL.md#hosted-authentication).
