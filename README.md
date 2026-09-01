# Claude Workspace

**Start, name, and resume Claude Code sessions from VS Code — with every workspace folder already in context.**

Run `claude` in a VS Code terminal without leaving the editor. Pick a mode from one command, give the
session a name, and get a terminal tab labelled with that name so several sessions stay straight.
Every folder in the window is wired up for you — one folder or six, no configuration either way.

## Features

- **All your folders, automatically** — the first workspace folder becomes the working directory and
  every other one is passed as `--add-dir`. Monorepo packages, a library and its consumers, Terraform
  beside the app it deploys: Claude sees them all from the first prompt, and they don't have to share
  a parent directory.
- **One command, three modes** — `Claude: Launch…` opens a quick pick for New, Continue last, or
  Resume. Bind that one and you're done.
- **Named sessions** — name a session `auth-refactor` or `bug-fix-123` and find it again later with
  Resume.
- **Readable terminal tabs** — each session's tab is titled with its name, so five open Claude tabs
  are five distinguishable tabs rather than five that say `claude`.
- **Nothing to configure** — no API keys, no settings file, no shipped keybindings. Install it, open a
  workspace, run a command.

## Quick Start

1. Install the [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) — VS Code 1.85+ and
   `claude` on your PATH are the only requirements
2. Install this extension from the
   [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=yazilim-vip.claude-workspace)
3. Open a workspace with one or more folders
4. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run **Claude: Launch…**

## Commands

Most people only need one of these. Bind **Claude: Launch…** and use it for everything.

**`Claude: Launch…`** — the entry point. Opens a quick pick: New session, Continue last, or Resume.
Bind it in `keybindings.json`:

```json
{ "key": "cmd+2", "command": "claude-workspace.launch" }
```

No keybindings ship with the extension, so it never steals a chord from your other tools.

The three modes are also available as commands of their own, if you'd rather bind them individually:

| Command | Runs |
| --- | --- |
| **Claude: Start Session** | `claude --name <name>` — prompts for a name; leave it empty for an unnamed session |
| **Claude: Continue Last Session** | `claude --continue` |
| **Claude: Resume Session** | `claude --resume` — pick from the CLI's own session list |

Session names accept letters, digits, `.`, `_` and `-`.

## Workspace Folders

Every command builds the same argument list. The first folder in the window is the working directory;
the rest are passed as `--add-dir`:

```
# Workspace with 3 folders — they don't need to share a parent:
#   /work/backend-api
#   /home/user/libs/shared-types
#   /projects/frontend

claude --add-dir /home/user/libs/shared-types --add-dir /projects/frontend
#      ↑ runs in /work/backend-api (cwd)
```

## Terminal Tabs

Each session's terminal is titled so several stay distinguishable, and marked with a sparkle icon:

| Command | Tab title |
| --- | --- |
| Start Session, named | the session name |
| Start Session, unnamed | `Claude` |
| Continue Last Session | `Claude (last)` |
| Resume Session | `Claude (resume)` |

The title reflects the name given **at launch**. Renaming a session later from inside the CLI
(`/rename`) does not retitle the tab — use `Terminal: Rename` for that.

Set `claudeWorkspace.terminalLocation` to `editor` to open sessions as an editor tab in the active
group instead of in the bottom panel (`panel` is the default).

## License

MIT
