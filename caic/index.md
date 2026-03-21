# gomode

**Coding Agents in Containers.** Manage multiple AI coding agents running in parallel in isolated Docker containers. Access them from your phone with Tailscale. All private.

## What is gomode?

gomode lets you run AI coding agents (Claude Code, Codex, Gemini CLI, Kilo) in isolated [md](../md/) containers, orchestrated through a unified web UI and Android app. Each task runs in its own container so agents never interfere with each other or your local checkout.

## Platform support

gomode is supported on **Linux** and **Windows via WSL2**. Interested in improving macOS support? [Join the Discord](https://discord.com/widget?id=1475502872564338822).

## Key features

- **Parallel agents** — run many agents simultaneously on different branches
- **Resilient sessions** — server restarts don't kill running agents; a relay process inside each container keeps agents alive across SSH disconnects
- **Forge integration** — automatic PR/MR creation and CI monitoring for [GitHub](./github) and [GitLab](./gitlab)
- **Web UI** — SolidJS frontend embedded in the binary
- **Android app** — voice-first companion app to manage agents from your phone

## Screenshots

### Interacting with an agent

![Interacting with an agent](/screenshots/task-detail.avif)

### Plan mode

![Plan mode](/screenshots/task-plan.avif)

### Ask mode — agent asks for user input

![Ask mode](/screenshots/task-ask.avif)

### Widget — generative UI

![Widget](/screenshots/task-widget.avif)

### Android app

<img src="/screenshots/android-task-list.avif" alt="Android task list" style="max-width: 300px">

## Quick start

```bash
curl gomode.dev/install.sh | bash
```

See [Installation](./installation) for full setup, and [Configuration](./configuration) for environment variables and systemd service setup.
