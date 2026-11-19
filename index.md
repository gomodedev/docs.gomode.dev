---
# Go Mode documentation homepage with supported platforms, real host captures, and integration entry points.
layout: home
hero:
  name: Go Mode
  text: Your app. Hands free.
  tagline: Voice for your web app. Web and Android clients, with a gateway for Windows, macOS, and Linux.
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

Go Mode connects web and Android clients to a voice gateway on Windows, macOS, or Linux. Hosts keep their own interfaces, accounts, and tools: [caic](https://caic.xyz) manages coding agents, and [mddb](https://mddb.app) manages documents and databases.

<div class="host-gallery">
<figure><ThemedScreenshot light="/screenshots/caic-tasks-light.webp" dark="/screenshots/caic-tasks-dark.webp" alt="caic's coding-agent task dashboard" :width="1280" :height="800" /><figcaption>caic · Coding agents in parallel</figcaption></figure>
<figure><ThemedScreenshot light="/screenshots/mddb-editor-light.webp" dark="/screenshots/mddb-editor-dark.webp" alt="mddb's document editor and workspace navigation" :width="1280" :height="800" /><figcaption>mddb · Documents and databases</figcaption></figure>
</div>

These captures render the real caic and mddb frontends with sample data from their screenshot suites.

<div class="native-gallery">
<figure><ThemedScreenshot light="/screenshots/connections-light.webp" dark="/screenshots/connections-dark.webp" alt="Native Go Mode service connections screen" :width="720" :height="1600" /><figcaption>Connect your own services</figcaption></figure>
<figure><ThemedScreenshot light="/screenshots/voice-settings-light.webp" dark="/screenshots/voice-settings-dark.webp" alt="Native Go Mode voice settings" :width="720" :height="1600" /><figcaption>Choose each voice stage and language</figcaption></figure>
</div>

The native connections and voice settings captures come from the running Android emulator.

</div>
