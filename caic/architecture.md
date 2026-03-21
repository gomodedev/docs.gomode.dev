# Architecture

gomode is a Go backend with a SolidJS frontend embedded in the binary. It requires Docker.

## Components

- **Backend** — Go HTTP server managing agent sessions, forge integration, and CI monitoring
- **Frontend** — SolidJS web UI, compiled and embedded in the binary
- **Android app** — Kotlin voice-first companion app
- **Containers** — Each task runs inside an isolated [md](../md/) container

## Session model

```
HOST (gomode server)            CONTAINER (md)
────────────────────            ───────────────────────────────
                                relay.py (setsid, survives SSH)
┌─────────┐   SSH stdin/stdout  ┌────────┐     ┌──────────────┐
│ Session │◄═══════════════════►│ attach │◄═══►│ Unix socket  │
│ (Go)    │     NDJSON bidir    └────────┘     │              │
└─────────┘                                    │ relay server │
                                output.jsonl ◄─┤ ┌────────┐   │
                                (append-only)  │ │ claude │   │
                                               │ │ code   │   │
                                               │ └────────┘   │
                                               └──────────────┘
```

A Python relay process inside each container owns the agent's stdin/stdout and persists across SSH disconnects, so the gomode server can restart without killing the agent or losing messages.

## Server restart behavior

On restart, gomode:

1. Discovers running containers via `md list`
2. Checks if the relay is still alive (Unix socket exists)
3. Reads `output.jsonl` from the container to restore full conversation history
4. Re-attaches to the relay from the last byte offset — no messages lost

If the relay is dead (agent crashed), gomode falls back to host-side JSONL logs and `claude --resume` to start a new session continuing the conversation.
