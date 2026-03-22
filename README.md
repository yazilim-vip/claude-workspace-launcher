# Claude Workspace Launcher

**Launch Claude Code with full multi-folder context — straight from VS Code.**

If you work with multi-root workspaces (monorepos, microservices, full-stack projects), you know the pain: Claude Code only sees one directory at a time. This extension fixes that. It automatically passes every folder in your VS Code workspace to `claude` via `--add-dir`, so Claude has the full picture from the start.

## Why Use This?

- **Multi-folder awareness** — Claude Code sees all your workspace folders, not just one. No more switching directories or losing context.
- **Named sessions** — Tag sessions with meaningful names like `auth-refactor` or `bug-fix-123` so you can find and resume them later.
- **Session continuity** — Continue your last session or resume any previous one with a single command. Your conversation history and context carry over.
- **Zero config** — Works out of the box. Just open your workspace and run a command.

## Quick Start

1. Install [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (`claude` must be on your PATH)
2. Install this extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=yazilim-vip.claude-workspace)
3. Open a workspace with one or more folders
4. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run any of:

| Command | What it does |
|---------|-------------|
| **Claude: Start Session** | Start a new session. Optionally give it a name for easy reference later. |
| **Claude: Continue Last Session** | Pick up right where you left off (`claude --continue`). |
| **Claude: Resume Session** | Browse and resume any previous session (`claude --resume`). |

## How It Works

The first folder in your workspace becomes the working directory. Every additional folder is passed as `--add-dir`:

```
# Workspace with 3 folders — they don't need to share a parent:
#   /work/backend-api
#   /home/user/libs/shared-types
#   /projects/frontend

claude --add-dir /home/user/libs/shared-types --add-dir /projects/frontend
#      ↑ runs in /work/backend-api (cwd)
```

The folders can live anywhere on your filesystem — different repos, different parent directories, different drives. VS Code multi-root workspaces let you group them, and this extension makes sure Claude sees them all.

## Use Cases

- **Monorepos** — Give Claude visibility into packages, shared libraries, and apps simultaneously.
- **Full-stack projects** — Let Claude see both your API and frontend code to keep contracts in sync.
- **Infrastructure + Application** — Work on Terraform modules alongside the app code they deploy.
- **Libraries + Consumers** — Edit a library and its downstream consumers in one session with full context.

## Requirements

- VS Code 1.85+
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and available on PATH

## License

MIT
