
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("zowe.testmule.retcode", (node) => vscode.window.showInformationMessage("Return info: "+node.job.retcode));
}