import * as vscode from "vscode";

/** Session names are used verbatim on the CLI, so keep them shell-safe. */
const SESSION_NAME_PATTERN = /^[A-Za-z0-9._-]+$/;

/** Single-quote a value for POSIX shells (workspace paths may contain spaces). */
function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/**
 * Build the claude CLI arguments from workspace folders.
 *
 * First folder  → cwd (primary)
 * Remaining     → --add-dir flags
 */
function buildClaudeArgs(
  folders: readonly vscode.WorkspaceFolder[],
  extra: string[] = []
): { cwd: string; args: string[] } {
  const [primary, ...rest] = folders;
  const args: string[] = [...extra];

  for (const folder of rest) {
    args.push("--add-dir", shellQuote(folder.uri.fsPath));
  }

  return { cwd: primary.uri.fsPath, args };
}

function ensureWorkspaceFolders(): readonly vscode.WorkspaceFolder[] | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showWarningMessage(
      "Claude Workspace: No folders in workspace. Add at least one folder first."
    );
    return undefined;
  }
  return folders;
}

/**
 * Where new terminals open, from `claudeWorkspace.terminalLocation`.
 * Defaults to the bottom panel — the behaviour every existing install has.
 */
function terminalLocation():
  | vscode.TerminalLocation
  | vscode.TerminalEditorLocationOptions {
  const setting = vscode.workspace
    .getConfiguration("claudeWorkspace")
    .get<string>("terminalLocation", "panel");

  return setting === "editor"
    ? { viewColumn: vscode.ViewColumn.Active }
    : vscode.TerminalLocation.Panel;
}

function launchClaude(args: string[], cwd: string, title: string): void {
  const terminal = vscode.window.createTerminal({
    name: title,
    cwd,
    location: terminalLocation(),
    iconPath: new vscode.ThemeIcon("sparkle"),
    color: new vscode.ThemeColor("terminal.ansiMagenta"),
  });
  terminal.show();
  terminal.sendText(["claude", ...args].join(" "));
}

export function activate(context: vscode.ExtensionContext): void {
  // Start a fresh session (optionally named)
  context.subscriptions.push(
    vscode.commands.registerCommand("claude-workspace.startSession", async () => {
      const folders = ensureWorkspaceFolders();
      if (!folders) return;

      const sessionName = await vscode.window.showInputBox({
        prompt: "Session name (leave empty for unnamed session)",
        placeHolder: "e.g. auth-refactor",
        validateInput: (value) =>
          !value || SESSION_NAME_PATTERN.test(value)
            ? undefined
            : "Use letters, digits, dot, underscore or hyphen only.",
      });

      // undefined means the user pressed Escape → cancel
      if (sessionName === undefined) return;

      const extra: string[] = [];
      if (sessionName) {
        extra.push("--name", sessionName);
      }

      const { cwd, args } = buildClaudeArgs(folders, extra);
      launchClaude(args, cwd, sessionName || "Claude");
    })
  );

  // Continue the most recent session
  context.subscriptions.push(
    vscode.commands.registerCommand("claude-workspace.continueSession", () => {
      const folders = ensureWorkspaceFolders();
      if (!folders) return;

      const { cwd, args } = buildClaudeArgs(folders, ["--continue"]);
      launchClaude(args, cwd, "Claude (last)");
    })
  );

  // Resume a specific session (interactive picker inside claude)
  context.subscriptions.push(
    vscode.commands.registerCommand("claude-workspace.resumeSession", () => {
      const folders = ensureWorkspaceFolders();
      if (!folders) return;

      const { cwd, args } = buildClaudeArgs(folders, ["--resume"]);
      launchClaude(args, cwd, "Claude (resume)");
    })
  );

  // Single entry point: pick a mode, then delegate to the command that owns it
  context.subscriptions.push(
    vscode.commands.registerCommand("claude-workspace.launch", async () => {
      const picked = await vscode.window.showQuickPick(
        [
          {
            label: "New session",
            detail: "Start a fresh session (asks for a name)",
            command: "claude-workspace.startSession",
          },
          {
            label: "Continue last",
            detail: "Resume the most recent conversation",
            command: "claude-workspace.continueSession",
          },
          {
            label: "Resume…",
            detail: "Pick from past sessions",
            command: "claude-workspace.resumeSession",
          },
        ],
        { placeHolder: "Claude session" }
      );

      if (!picked) return;
      await vscode.commands.executeCommand(picked.command);
    })
  );
}

export function deactivate(): void {}
