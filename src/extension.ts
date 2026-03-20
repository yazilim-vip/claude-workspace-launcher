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
  // Start a fresh session (optionally named)
  context.subscriptions.push(
    vscode.commands.registerCommand("claude-workspace.startSession", async () => {
      const folders = ensureWorkspaceFolders();
      if (!folders) return;

      const sessionName = await vscode.window.showInputBox({
        prompt: "Session name (leave empty for unnamed session)",
        placeHolder: "e.g. auth-refactor",
      });

      // undefined means the user pressed Escape → cancel
      if (sessionName === undefined) return;

      const extra: string[] = [];
      if (sessionName) {
        extra.push("--name", sessionName);
      }

      const { cwd, args } = buildClaudeArgs(folders, extra);
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
