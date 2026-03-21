# Harnesses

The container includes `/home/user/src/AGENTS.md` with information about preinstalled tools.

## Supported agents

| Agent | Config file |
|---|---|
| [amp](https://ampcode.com/manual#AGENTS.md) | `~/.config/amp/AGENTS.md` |
| [claude](https://www.anthropic.com/engineering/claude-code-best-practices) | `~/.claude/CLAUDE.md` |
| [codex](https://developers.openai.com/codex/guides/agents-md/) | `~/.codex/AGENTS.md` |
| [gemini](https://geminicli.com/docs/cli/gemini-md/) | `~/.gemini/GEMINI.md` |
| [kilo](https://kilo.ai/docs/agent-behavior/custom-rules) | `~/.kilocode/rules/*.md` |
| [opencode](https://opencode.ai/docs/rules/) | `~/.config/opencode/AGENTS.md` |
| [pi](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) | `~/.pi/agent/AGENTS.md` |
| [qwen](https://qwenlm.github.io/qwen-code-docs/en/users/configuration/settings/) | `~/.qwen/QWEN.md` |

## Claude Code recommended settings

Enable YOLO mode in `~/.claude/settings.json`:

```json
{
  "alwaysThinkingEnabled": true,
  "permissions": {
    "defaultMode": "dontAsk"
  },
  "skipDangerousModePermissionPrompt": true
}
```

## Centralizing AGENTS.md

Use symlinks to maintain a single AGENTS.md for all harnesses:

```bash
mkdir -p ~/.config/agents ~/.config/amp ~/.claude ~/.codex ~/.gemini \
         ~/.kilocode/rules ~/.config/opencode ~/.pi/agent ~/.qwen

echo "Read ~/AGENTS.md if present." >> ~/.config/agents/AGENTS.md
ln -s ../../.config/agents/AGENTS.md ~/.config/amp/AGENTS.md
ln -s ../.config/agents/AGENTS.md    ~/.claude/CLAUDE.md
ln -s ../.config/agents/AGENTS.md    ~/.codex/AGENTS.md
ln -s ../.config/agents/AGENTS.md    ~/.gemini/AGENTS.md
ln -s ../../.config/agents/AGENTS.md ~/.kilocode/rules/AGENTS.md
ln -s ../../.config/agents/AGENTS.md ~/.config/opencode/AGENTS.md
ln -s ../../.config/agents/AGENTS.md ~/.pi/agent/AGENTS.md
ln -s ../.config/agents/AGENTS.md    ~/.qwen/AGENTS.md
```

## Centralizing skills

Skills can also be centralized under `~/.config/agents/skills/`:

```bash
mkdir -p ~/.config/agents/skills ~/.claude ~/.codex ~/.cursor \
         ~/.gemini/antigravity ~/.kilocode ~/.config/opencode ~/.pi/agent ~/.qwen

ln -s ../.config/agents/skills/          ~/.claude/skills
ln -s ../.config/agents/skills/          ~/.codex/skills
ln -s ../.config/agents/skills/          ~/.cursor/skills
ln -s ../../.config/agents/skills/       ~/.gemini/antigravity/skills
ln -s ../.config/agents/skills/          ~/.gemini/skills
ln -s ../.config/agents/skills/          ~/.kilocode/skills
```

Skills locations by harness:

| Agent | Skills path |
|---|---|
| amp | `~/.config/agents/skills/**/SKILL.md` |
| claude | `~/.claude/skills/<name>/SKILL.md` |
| codex | `~/.codex/skills/**/SKILL.md` |
| gemini | `~/.gemini/skills/<name>/SKILL.md` |
| kilo | `~/.kilocode/skills/<name>/SKILL.md` |
| opencode | `~/.config/opencode/skill/<name>/SKILL.md` |
| pi | `~/.pi/agent/skills/**/SKILL.md` |
| qwen | `~/.qwen/skills/<name>/SKILL.md` |
