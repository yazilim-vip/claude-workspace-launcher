# Claude Workspace Launcher

VS Code extension that launches Claude Code sessions with all workspace folders automatically passed via `--add-dir`.

## How It Works

1. Open a VS Code workspace and add your folders as usual
2. Run a command from the palette (`Cmd+Shift+P`):
   - **Claude: Start Session** — new session, first folder is cwd, rest are `--add-dir`
   - **Claude: Continue Last Session** — `claude --continue` with the same folder setup
   - **Claude: Resume Session** — `claude --resume` (interactive picker)
3. A terminal opens and runs `claude` with the right flags

Example with two workspace folders:

```
claude --add-dir /path/to/folder2
#      ↑ runs in /path/to/folder1 (cwd)
```

## Development

```bash
npm install
npm run compile
```

Press `F5` in VS Code to launch the Extension Development Host.

## Requirements

- VS Code 1.85+
- Claude Code CLI (`claude`) installed and on PATH
