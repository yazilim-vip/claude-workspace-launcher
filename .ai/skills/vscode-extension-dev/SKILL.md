---
name: vscode-extension-dev
description: >
  VS Code extension development patterns — command registration, terminal launch,
  workspace folder handling, CI/CD pipeline with version enforcement and marketplace
  publishing. Use when developing extension features, adding commands, or modifying
  the build/publish pipeline.
---

# VS Code Extension Development

## Architecture

Single-file extension — all logic in `src/extension.ts`.

### Core Functions

| Function | Purpose |
|----------|---------|
| `buildClaudeArgs(folders, extra)` | First folder = cwd, rest become `--add-dir` flags |
| `ensureWorkspaceFolders()` | Validates workspace has folders |
| `launchClaude(args, cwd)` | Creates VS Code terminal, runs `claude ...args` |
| `activate(context)` | Registers 3 commands |

### Commands

| Command | ID | Behavior |
|---------|----|----------|
| Claude: Start Session | `claude-workspace.startSession` | Prompts for session name, passes `--name` |
| Claude: Continue Last Session | `claude-workspace.continueSession` | Passes `--continue` flag |
| Claude: Resume Session | `claude-workspace.resumeSession` | Passes `--resume` flag |

## CI/CD Pipeline

4-stage pipeline in `.github/workflows/ci.yml`:

1. **version-check** (PRs only) — ensures `package.json` version bumped vs main
2. **build** — `npm ci` + compile + `vsce package`, uploads `.vsix` artifact
3. **publish** (main only) — publishes to VS Code Marketplace via `VSCE_PAT`
4. **release** (main only) — creates GitHub Release with tag + `.vsix` attachment

## Key Rules

- Never push directly to `main` — PR required
- Every PR must bump version in `package.json` (CI enforces this)
- Version bumps: major (breaking), minor (features), patch (fixes/docs)
- No bundler — tsc compiles directly to `out/` (CommonJS)
- No runtime dependencies — keep it lightweight

## Commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Compile | `npm run compile` |
| Watch | `npm run watch` |
| Package VSIX | `npx @vscode/vsce package` |
