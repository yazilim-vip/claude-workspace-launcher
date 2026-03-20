# Claude Workspace Launcher

VS Code extension that launches Claude Code sessions with all workspace folders via `--add-dir`.

## Git Workflow

- **Never push directly to `main`.** All changes must go through a merge request.
- Every MR targeting `main` **must** bump the version in `package.json` (semver: major, minor, or patch).
- The CI `version-check` job enforces this — MRs without a version bump will fail.
- On merge to `main`, CI automatically publishes to the VS Code Marketplace and creates a GitLab release with a `vX.Y.Z` tag.

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
.gitlab-ci.yml     — CI: version-check, build, publish, release
```

## Build & Run

```bash
npm install
npm run compile
# Press F5 in VS Code to launch Extension Development Host
```
