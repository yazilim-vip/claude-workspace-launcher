# Claude Workspace Launcher

VS Code extension that launches Claude Code sessions with multi-folder workspace support. Single-file TypeScript extension with automated CI/CD publishing.

## IMPORTANT: Read skills FIRST

Before making ANY changes, you MUST read the relevant `.ai/skills/` files. They contain the project's conventions, patterns, and capabilities. Do not guess or improvise — the answers are there.

- `.ai/skills/vscode-extension-dev/` — extension architecture, command registration, CI/CD pipeline, publishing rules

## Skills

- Skills: `.ai/skills/` — on-demand agent capabilities and project knowledge following [agentskills.io](https://agentskills.io/specification)

## Tech Stack

- TypeScript 5.3 (strict mode)
- VS Code Extension API ^1.85.0
- No runtime dependencies (dev-only: @types/vscode, @types/node, @vscode/vsce)
- No bundler — tsc compiles to `out/` (CommonJS, ES2022)

## Project Structure

```
src/
└── extension.ts          # All extension logic (single file)
out/
└── extension.js          # Compiled output (entry point)
.github/workflows/
└── ci.yml                # 4-stage CI/CD pipeline
```

## Build & Run

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Compile | `npm run compile` |
| Watch | `npm run watch` |
| Package VSIX | `npx @vscode/vsce package` |
| Test locally | F5 in VS Code (Extension Development Host) |

## Git Workflow

- Always fetch and update local `main` before creating a feature branch
- Never push directly to `main` — PR required
- Every PR must bump version in `package.json` (CI enforces this)

| Change type | Bump | Example |
|---|---|---|
| Breaking / incompatible changes | **major** | 1.0.0 → 2.0.0 |
| New features, backward-compatible | **minor** | 0.2.0 → 0.3.0 |
| Bug fixes, docs, CI tweaks | **patch** | 0.3.0 → 0.3.1 |

## Code Style

- Extension ID: `yazilim-vip.claude-workspace`, Publisher: `yazilim-vip`
- No bundler — tsc compiles directly to `out/` (CommonJS)
- No runtime dependencies — keep it lightweight

## Local Testing

1. **F5 in VS Code** — opens Extension Development Host, test via Command Palette
2. **Install VSIX** — `npx @vscode/vsce package` then `code --install-extension claude-workspace-*.vsix`

## CI/CD (GitHub Actions)

4-stage pipeline:
1. **version-check** (PRs only) — ensures version bumped vs main
2. **build** — compile + `vsce package`, uploads `.vsix` artifact
3. **publish** (main only) — publishes to VS Code Marketplace via `VSCE_PAT`
4. **release** (main only) — creates GitHub Release with tag + `.vsix`
