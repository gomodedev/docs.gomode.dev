# Android setup

Go Mode loads a compatible service’s existing web frontend and adds native voice, notifications, settings, and optional Halo glasses integration.

## Build from source

The supported setup builds the Android app from [the Go Mode repository](https://github.com/maruel/gomode). Go Mode is a library and Android app; there is no `gomode` coding-agent CLI to install.

```bash
git clone https://github.com/maruel/gomode.git
cd gomode
make android-sdk
make android-push
```

`make android-sdk` checks or installs the SDK packages required by the project. `make android-push` builds the debug app, then installs and launches it on the connected device. Enable USB debugging and authorize the device first; check it with `adb devices`.

For an emulator:

```bash
make android-start-emulator
make android-push
```

The debug application ID is `com.fghbuild.gomode`. Build targets and prerequisites are maintained in the [upstream Makefile](https://github.com/maruel/gomode/blob/main/Makefile).

## Add your service

1. Open **Settings**. On first use the new-service form is already open. With a saved service, use the **New service** action beside the **Services** heading.
2. Optionally enter an **Alias**, the name that tells saved services apart.
3. Enter the host’s **Server URL**, including `https://` or `http://`. Use HTTPS for deployed hosts; HTTP is supported for reachable local development services.
4. Tap the check mark to add the service.
5. Sign in through the host’s frontend when required.

Each saved service is a card with its alias, URL, readiness, and any connection error. A failed connection shows a retry action. **Needs attention** marks a hosted page that waits for you, and **Active** marks the service on screen.

The edit action turns the card into its editor. Go Mode saves changes automatically, and the check mark closes the editor. The delete action asks for confirmation. Go Mode rejects an alias or URL that another saved service already uses, ignoring alias case. A service cannot be deleted during a voice session.

The service URL must be reachable from the phone. A phone’s `localhost` means the phone, not your development machine. Use a reachable address or a private network such as Tailscale. Android emulator access to a host machine commonly uses `10.0.2.2`; for local instrumented tests, the project runner configures `adb reverse`.

<div class="native-gallery">
<figure><a class="docs-screenshot-link" href="/screenshots/connections.webp" target="_blank" rel="noopener"><img src="/screenshots/connections.webp" width="1080" height="2400" alt="Native service connections screen" loading="lazy"></a><figcaption>Saved service connections</figcaption></figure>
<figure><a class="docs-screenshot-link" href="/screenshots/service-editor.webp" target="_blank" rel="noopener"><img src="/screenshots/service-editor.webp" width="1080" height="2400" alt="Native Go Mode connection editor" loading="lazy"></a><figcaption>Add or edit a saved service</figcaption></figure>
</div>

## Choose how you speak

In native Settings, select **Cloud voice** or **On-device voice**, then set the voice language. Go Mode locks the mode, the voice choice, and the language while a voice session connects or stays active.

### Cloud voice

Cloud voice sends microphone audio over WebRTC and plays the audio the gateway returns. The **Model** list shows the audio choices your gateway advertises, and each new session uses the choice you saved. When the selected choice advertises speaking voices, a **Speaking voice** list selects the voice you hear; **Provider default** keeps the provider’s voice. [Voice gateway](./voice) covers how a gateway offers those choices.

### On-device voice

On-device voice uses Android recognition for speech and Android text to speech for replies. The **Engine** choice decides what handles each turn:

- **Remote LLM:** the transcript goes to the gateway’s text session. The gateway supplies the language model and the device supplies speech. The **LLM** list selects a text-capable gateway choice.
- **Local LLM:** a LiteRT-LM model runs on the phone. The **Model** list selects the weights.
- **Whistle + Needle:** an experimental pair that matches recognized speech to tool actions. It does not use a conversational language model.

Local LLM turns run on the device. Tool calls still reach the host through MCP.

On-device speech does not mean the whole conversation works offline. Recognition availability and processing depend on Android and the installed speech service. Remote LLM needs a compatible gateway.

The voice language is a BCP 47 tag, `en-US` by default. It sets the device speech language and the language the assistant replies in.

**Show assistant reasoning** and **Show usage stats** add the model’s reasoning and token counts to the transcript. **Thinking music** plays while the assistant works; its control previews it.

<a class="docs-screenshot-link docs-screenshot-link--capture" href="/screenshots/voice-settings.webp" target="_blank" rel="noopener"><img class="native-capture" src="/screenshots/voice-settings.webp" width="1080" height="2400" alt="Native voice mode and language settings" loading="lazy"></a>

### Download a local model

Select **Local LLM**, select a model, and tap **Download model**.

| Model             | Context limit |
| ----------------- | ------------- |
| Gemma 4 E2B / E4B | 10,240 tokens |
| LFM3 1.7B · 32K   | 32,768 tokens |
| LFM3 1.7B · 64K   | 65,536 tokens |

Downloads continue in the background and resume after interruptions. **Cancel download** discards partial data. Settings shows the installed size and the available storage. **Delete model** unloads the weights and removes the files. Downloaded models stay installed when you switch between them. End an active voice session before changing the model.

**Model load diagnostics** lists recent load stages, durations, and sampled memory. A load that ended the app is matched to Android’s exit record on the next launch.

## Use the voice controls

The voice bar sits at the bottom of the hosted page. The microphone button cycles three states:

- **Listening:** the microphone is open.
- **Mute once:** the microphone stays closed until the current reply ends or you interrupt it.
- **Muted:** the microphone stays closed until you unmute it.

The assistant can call `mute` when you ask it to mute you; it uses **Mute once**. Speaking during a reply interrupts it. Ended conversations stay behind the **Transcript** control. **Recent tool calls** lists the tools the assistant ran.

## Use several services

Every ready saved service stays callable. Switching the visible service keeps one conversation, transport, transcript, and foreground notification.

Voice can list the saved services and switch between them. The **Next server** control beside Settings cycles saved services in their saved order and wraps to the first. It works with voice active, idle, or unavailable, and appears once two services are saved.

`hang_up` ends the voice session. Whistle + Needle does not offer the native voice commands.

## Dial from your car

Go Mode voice sessions are Android self-managed calls, so a car or headset hang-up ends voice. A car can also start voice:

1. Save a service, sign in, and test its voice configuration.
2. Under **Dial from your car**, allow microphone access and choose **Enable dial-to-start**.
3. Select Go Mode in Android’s call-redirection chooser.
4. Under **Car contacts**, tap **Create contacts** to import a contact for Go Mode and for each saved service.
5. Enable contact sharing for the car in Bluetooth settings.

Dialing a service contact starts voice for that service. Dialing the **Go Mode** contact starts the last selected service. Go Mode cancels the cellular call before it is placed. Other numbers dial normally, and emergency calls stay with Android. The phone must have been unlocked once since boot, and microphone permission and host sign-in must already be in place.

During a locked car call, the call surface shows status, the transcript, audio routes, and hang-up; hosted pages stay behind the lock screen. **Show service on lock screen** shows the hosted service above the lock screen during car calls. Anyone holding the phone can then use your services without unlocking.

Contact numbers come from a fictitious range and survive renames and URL changes. Recreate the contacts after you clear app data or move to another phone.

## Notifications

Allow notification permission when you want host alerts and background monitoring. The host publishes alerts through MCP and Go Mode handles native delivery.

Alerts are suppressed for the service visible in the foreground and during shared voice. Tapping an alert selects its saved service and opens the host destination, including from a cold start. Go Mode opens only HTTP(S) destinations on the saved service’s origin. During voice, a new alert reaches the assistant, and the host’s instructions decide whether it is announced. The [MCP and skills](./skills) page defines the alert fields, destinations, reconciliation, and expiry.

## Hosted page permissions

Hosted pages can request camera and microphone access. Go Mode asks for the Android runtime permissions that are still missing, then answers the page request. Captures stop when the page is hidden.

Hosted file inputs open the Android system document picker, which lists Screenshots, Downloads, and other document providers. Permission prompts, file pickers, and dialogs open only from the visible page. Pinch to zoom hosted content.

## Halo

Halo settings connect optional Brilliant Labs Halo glasses. The emulator capture shows configuration, not a verified physical-device connection.

<a class="docs-screenshot-link docs-screenshot-link--capture" href="/screenshots/halo.webp" target="_blank" rel="noopener"><img class="native-capture" src="/screenshots/halo.webp" width="1080" height="2400" alt="Native Halo glasses configuration" loading="lazy"></a>

See [Troubleshooting](./troubleshooting) when the hosted page loads but native features remain unavailable.
