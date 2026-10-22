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
    details: Use cloud voice with a gateway speaking voice, or run a model on the phone. Conversation still calls your host’s MCP tools.
    link: /guide/voice
  - title: Several services at once
    details: Save each service, switch the frontend between them, and keep one voice conversation and transcript.
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
<figure><img src="/screenshots/connections.webp" width="1080" height="2400" alt="Native Go Mode service connections screen" loading="lazy"><figcaption>Connect your own services</figcaption></figure>
<figure><img src="/screenshots/hosted-service.webp" width="1080" height="2400" alt="Go Mode shell displaying the Field Notes demonstration service" loading="lazy"><figcaption>A hosted frontend inside the native shell</figcaption></figure>
<figure><img src="/screenshots/voice-settings.webp" width="1080" height="2400" alt="Native Go Mode voice settings" loading="lazy"><figcaption>Choose voice mode and language</figcaption></figure>
</div>

Captures come from the running Android emulator. Field Notes is a demonstration service.

</div>
