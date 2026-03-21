# md

**Branch-locked development containers for AI coding agents.** Each container is locked to a repository-branch pair. Safe parallel work, no conflicts.

## The problem

AI coding agents work best in YOLO mode (full command execution). But running them locally creates:

- **Branch conflicts** — agent changes interfere with your local checkout
- **Test conflicts** — simultaneous test runs cause failures and race conditions
- **Environment pollution** — accumulated dependencies cause hidden bugs
- **Context switching** — switching branches while an agent works loses progress

## Platform support

md is supported on **Linux** and **Windows via WSL2**. Interested in improving macOS support? [Join the Discord](https://discord.com/widget?id=1475502872564338822).

## The solution

`md` gives each agent a **complete, isolated container** with a full git clone:

- Run agents on multiple branches simultaneously
- Switch local branches without affecting running agents
- Run tests in parallel without conflicts
- Keep your local checkout clean
- Delete containers cleanly when done

## Quick start

```bash
# Start container for your current branch (auto-SSH in)
git checkout -b wip origin/main
md start

# Inside the container — run your agent
cd ~/src/<repo-name>
claude

# Back on host — check changes and sync
md diff
md pull
```

## Install

```bash
curl gomode.dev/install.sh | bash
```

See [Installation](./installation) for all options, [Commands](./commands) for the full command reference, [Configuration](./configuration) for caches and environment variables, and [Harnesses](./harnesses) for agent-specific setup.
