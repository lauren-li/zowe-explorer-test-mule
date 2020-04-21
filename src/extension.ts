
import * as vscode from 'vscode';

export let EXTENDER_API;
export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("zowe.testmule.retcode", (node) => doSomeStuff(node));

    const baseExt = vscode.extensions.getExtension('zowe.vscode-extension-for-zowe');
    try {
        if (baseExt && baseExt.exports) {
            EXTENDER_API = baseExt.exports.getExplorerExtenderApi();
            return;
        }
    } catch (error) {
        vscode.window.showWarningMessage("TestMule: Unable to access Zowe Explorer API");
    }
}

async function doSomeStuff (node: vscode.TreeItem) {
    const secondary = await EXTENDER_API.getLinkedProfile(node, "tso");
    if (secondary) {
        vscode.window.showInformationMessage("Accessed Profile "+ secondary.name);
    } else {
        vscode.window.showWarningMessage("TestMule: Unable to access Zowe Explorer profile");
    }
}