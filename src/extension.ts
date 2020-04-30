
import * as vscode from 'vscode';
import * as zowe from "@zowe/cli";
import { IProfileLoaded } from '@zowe/imperative';

export let EXTENDER_API;
let outputChannel

export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("zowe.testmule.retcode", (node) => processReturnCode(node));
    vscode.commands.registerCommand("zowe.testmule.jobstatus", (node) => jobstatus(node));
    vscode.commands.registerCommand("zowe.testmule.context.spy", (node) => contextSpy(node));

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

async function processReturnCode (node: vscode.TreeItem) {
    const secondary = await EXTENDER_API.getLinkedProfile(node, "zftp");
    if (secondary) {
        vscode.window.showInformationMessage("Used API to access zftp profile named "+ secondary.name);
    } else {
        vscode.window.showWarningMessage("TestMule: Unable to access Zowe Explorer profile");
    }
    vscode.window.showWarningMessage("Additional information for node indicates return code of "+ node.contextValue.substring(node.contextValue.indexOf("_rc=")+4));
}

async function jobstatus (node: vscode.TreeItem) {
    const secondary: IProfileLoaded = await EXTENDER_API.getLinkedProfile(node, "tso");
    const label = node.label;
    if (secondary) {
        const session = zowe.ZosmfSession.createBasicZosmfSession(secondary.profile);
        if (!outputChannel) {
            outputChannel = vscode.window.createOutputChannel("Test Mule TSO Command");
        }
        outputChannel.appendLine("> status " + label);
        const res = (await zowe.IssueTso.issueTsoCommand(session, "DEFAULT", `status ${node.label}`));
        outputChannel.appendLine(res.commandResponse, true);
        outputChannel.show(true);
    } else {
        vscode.window.showWarningMessage("TestMule: Unable to access Zowe Explorer profile");
    }
}

async function contextSpy (node: vscode.TreeItem) {
    vscode.window.showInformationMessage("Node " + node.label + " has a context of " + node.contextValue );
}