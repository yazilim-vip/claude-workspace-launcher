# Claude Workspace Launcher

VS Code extension that launches Claude Code sessions with all workspace folders via `--add-dir`.

## Git Workflow

- **Never push directly to `main`.** All changes must go through a pull request.
- Every PR targeting `main` **must** bump the version in `package.json` (semver: major, minor, or patch).
- The CI `version-check` job enforces this — PRs without a version bump will fail.
- On merge to `main`, CI automatically publishes to the VS Code Marketplace and creates a GitHub release with a `vX.Y.Z` tag.

## Versioning Guide

| Change type | Bump | Example |
|---|---|---|
| Breaking / incompatible changes | **major** | 1.0.0 -> 2.0.0 |
| New features, backward-compatible | **minor** | 0.2.0 -> 0.3.0 |
| Bug fixes, docs, CI tweaks | **patch** | 0.3.0 -> 0.3.1 |

## Project Structure

```
src/extension.ts    — extension entry point (activate/deactivate)
package.json        — manifest, commands, marketplace metadata
.github/workflows/ — CI: version-check, build, publish, release
```

## Build & Run

```bash
npm install
npm run compile
# Press F5 in VS Code to launch Extension Development Host
```

## Local Testing

There are two ways to test the extension locally:

### Option 1: Extension Development Host (F5)

1. Open this project in VS Code
2. Press **F5** (or run the `Run Extension` launch config)
3. A new VS Code window opens with the extension loaded
4. Test commands via Command Palette (`Cmd+Shift+P` → "Claude: ...")
5. Changes require restarting the Extension Development Host

### Option 2: Install VSIX locally

Package and install the extension into your main VS Code instance:

```bash
# Build the .vsix package
npx @vscode/vsce package

# Install it
code --install-extension claude-workspace-*.vsix
```

After installing, reload VS Code (`Cmd+Shift+P` → "Developer: Reload Window").

To uninstall later:

```bash
code --uninstall-extension yazilim-vip.claude-workspace
```

### VS Code Tasks

Use **Terminal → Run Task...** for common build operations:

- **Compile** — `npm run compile` (default build task, `Cmd+Shift+B`)
- **Watch** — `npm run watch` (recompile on file changes)
- **Package VSIX** — builds the `.vsix` file
- **Install VSIX** — packages and installs into local VS Code
