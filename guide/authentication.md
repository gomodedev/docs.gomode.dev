# Authentication

Your host owns user accounts, login, sessions, and authorization. The Android shell shares each page’s identity with native MCP and voice features through a narrow origin-bound bridge.

## Report a settled identity

The shell exposes `window.gomodeAuth.postMessage(...)` only to the saved service origin and accepts messages from its main frame. Bridge version 3 binds every message to the current document: it carries the document token from `window.goModeFrontendDocument` and a fresh request ID. Use the [browser package](./sdk) to send these messages.

Capture the preparation client when the frontend mounts, before asynchronous authentication. A cookie-backed host reports the result after checking the identity:

```ts
import { createFrontendPreparationClient } from "@maruel/gomode/web/FrontendVoiceTools";

const client = createFrontendPreparationClient();

// After the host confirms the signed-in user:
const identity = client.publishAuth({ authChanged: true, nativeAccess: true });
const scope = identity.createScope();
scope.setTools(frontendTools); // [] registers zero tools.
scope.setDataReady(true);
```

Set `nativeAccess` to `true` only after confirming the signed-in user, or for a host that requires no authentication. A failed or unknown identity check must not grant native access. A 401 from the identity endpoint means logged out; a 401 from another endpoint keeps access paused.

Native voice starts only after the page is prepared: the identity is acknowledged, every intended frontend tool is registered, and the required initial data has loaded. An empty data set and zero tools are valid.

Before logout or account switching, publish `authChanging`. Each `publishAuth` call retires the previous identity and its scope:

```ts
client.publishAuth({ authChanging: true });
```

After the session change settles, publish `authChanged` again with the resulting access state. This stops voice and monitoring before credentials change and resumes them only after validation. A new account cannot join a conversation that started with a different account; the conversation ends instead.

## Bearer-backed hosts

Send a validated bearer token through the same call:

```ts
client.publishAuth({ bearerToken: token });
```

Clear it before logout:

```ts
client.publishAuth({ bearerToken: null });
```

The shell keeps the bearer in memory, not on disk. Do not put tokens in URLs or logs. Native requests pin the identity captured when the voice session starts and reject a changed credential before executing a tool request.

## Hosts without the browser package

Follow the bridge 3 contract in [FrontendVoiceTools.ts](https://github.com/maruel/gomode/blob/main/web/src/FrontendVoiceTools.ts). Each `gomodeAuth` message also carries `frontendDocument` and a fresh `frontendRequest`, both nonblank strings of at most 128 characters. Access-granting messages receive a token, and readiness goes to `window.gomodeFrontendReadiness`. A manifest that advertises another bridge version is incompatible.

## Authorize at the host

Discovery stays public. MCP tools, resources, and embedded voice routes enforce the host’s policy. An external gateway verifies a short-lived host-issued token; it does not run your login flow or hold your host’s credentials. See [Voice gateway](./voice).

## Device sign-in

The `devicelogin` Go package pairs a browser that is not signed in with an account that is. The new browser shows a code. A signed-in user reviews the code and the requesting browser’s details, then approves or denies it. On approval the host issues its normal session, with the same permissions and lifetime as an ordinary login.

The host supplies approver identity, login eligibility, audit persistence, and session creation through `devicelogin.Host`. Mount the handlers behind the host’s normal network and origin protections. Pending requests live in memory, so a restart cancels them. The browser side is `@maruel/gomode/web/DeviceLogin`: `DeviceLoginDisplay` shows the code and `DeviceLoginApproval` asks the approver. See [the package contract](https://pkg.go.dev/github.com/maruel/gomode/devicelogin).

## Provider login limitations

Some identity providers reject embedded WebView login or require browser-only capabilities. The current shell does not implement the external-browser login handoff described in the repository’s design notes. Test your host’s actual login flow on Android; do not assume that desktop login proves WebView compatibility.

## Several services on one origin

Saved services share Android WebView cookies, so services on one origin share a cookie identity. An `authChanging` or logout from one page pauses its same-origin peers at once, while a new sign-in grants access only to the page that reported it. Each page reports its own settled identity.

The authoritative bridge behavior is in [ServiceBearerStore.kt](https://github.com/maruel/gomode/blob/main/android/gomode/src/main/java/com/fghbuild/gomode/ui/web/ServiceBearerStore.kt) and [ServiceShellSession.kt](https://github.com/maruel/gomode/blob/main/android/gomode/src/main/java/com/fghbuild/gomode/ui/web/ServiceShellSession.kt).
