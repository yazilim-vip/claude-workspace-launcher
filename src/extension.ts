import * as vscode from "vscode";

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
    args.push("--add-dir", folder.uri.fsPath);
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

function launchClaude(args: string[], cwd: string): void {
  const terminal = vscode.window.createTerminal({
    name: "Claude",
    cwd,
  });
  terminal.show();
  const cmd = ["claude", ...args].join(" ");
  terminal.sendText(cmd);
}

export function activate(context: vscode.ExtensionContext): void {
  // Start a fresh session
  context.subscriptions.push(
    vscode.commands.registerCommand("claude-workspace.startSession", () => {
      const folders = ensureWorkspaceFolders();
      if (!folders) return;

      const { cwd, args } = buildClaudeArgs(folders);
      launchClaude(args, cwd);
    })
  );

  // Continue the most recent session
  context.subscriptions.push(
    vscode.commands.registerCommand("claude-workspace.continueSession", () => {
      const folders = ensureWorkspaceFolders();
      if (!folders) return;

      const { cwd, args } = buildClaudeArgs(folders, ["--continue"]);
      launchClaude(args, cwd);
    })
  );

  // Resume a specific session (interactive picker inside claude)
  context.subscriptions.push(
    vscode.commands.registerCommand("claude-workspace.resumeSession", () => {
      const folders = ensureWorkspaceFolders();
      if (!folders) return;

      const { cwd, args } = buildClaudeArgs(folders, ["--resume"]);
      launchClaude(args, cwd);
    })
  );
}

export function deactivate(): void {}
