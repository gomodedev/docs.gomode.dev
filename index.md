---
# Go Mode documentation homepage with Android setup and host integration entry points.
layout: home
hero:
  name: Go Mode
  text: Your app. Hands free.
  tagline: A native Android shell and voice platform for your own web app.
  actions:
    - theme: brand
      text: Set up Android
      link: /guide/android
    - theme: alt
      text: Build a host
      link: /guide/host
features:
  - title: Bring your own service
    details: Keep your frontend, accounts, and product APIs. Go Mode discovers the host and adds native capabilities.
    link: /guide/architecture
  - title: Voice your way
    details: Pick a realtime model, or compose recognition, language model, and speech stages on the gateway or the phone. Conversation still calls your host’s MCP tools.
    link: /guide/voice
  - title: Several services at once
    details: Every saved service stays signed in. One voice conversation follows the service on screen. Dial a service from your car.
    link: /guide/android
  - title: Alerts you can open
    details: Host alerts arrive as notifications that open the right page in the right saved service.
    link: /guide/host
  - title: Reusable by design
    details: Go packages, a SolidJS browser integration, and generated TypeScript, Kotlin, and Swift clients.
    link: /guide/sdk
---

<div class="home-intro">

## Start from the running product

Go Mode owns Android, voice, and the shared host contract. [caic](https://docs.caic.xyz/caic/) owns coding-agent workflows; its task list, conversation, and review screens stay in its hosted frontend.

<div class="native-gallery">
<figure><a class="docs-screenshot-link" href="/screenshots/connections.webp" target="_blank" rel="noopener"><img src="/screenshots/connections.webp" width="720" height="1600" alt="Native Go Mode service connections screen" loading="lazy"></a><figcaption>Connect your own services</figcaption></figure>
<figure><a class="docs-screenshot-link" href="/screenshots/hosted-service.webp" target="_blank" rel="noopener"><img src="/screenshots/hosted-service.webp" width="720" height="1600" alt="Go Mode shell displaying the Field Notes demonstration service" loading="lazy"></a><figcaption>A hosted frontend inside the native shell</figcaption></figure>
<figure><a class="docs-screenshot-link" href="/screenshots/voice-settings.webp" target="_blank" rel="noopener"><img src="/screenshots/voice-settings.webp" width="720" height="1600" alt="Native Go Mode voice settings" loading="lazy"></a><figcaption>Choose each voice stage and language</figcaption></figure>
</div>

Captures come from the running Android emulator. Field Notes is a demonstration service.

</div>
