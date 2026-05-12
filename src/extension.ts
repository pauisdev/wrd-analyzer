import * as vscode from "vscode";
import completion from "./events/completion";
import definition from "./events/definition";
import hover from "./events/hover";
import { createConfigFiles } from "./file";

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("WRD Analyzer started!");
	console.log(vscode.workspace.workspaceFolders);

	const createConfigFilesCommandDisposable = vscode.commands.registerCommand(
		"wrd-analyzer.create-config-files",
		() => {
			const workspace = vscode.workspace.workspaceFolders?.at(0);
			if (workspace === undefined) {
				vscode.window.showErrorMessage(
					"No workspace is open. Unable to create config files",
				);
				return;
			}
			createConfigFiles(workspace.uri.fsPath);
			vscode.window.showInformationMessage("Config files created!");
		},
	);

	const hoverDisposable = vscode.languages.registerHoverProvider("wrd", {
		provideHover(document, position, _token) {
			return hover(document, position);
		},
	});

	const definitionDisposable = vscode.languages.registerDefinitionProvider(
		"wrd",
		{
			provideDefinition(document, position, _token) {
				return definition(document, position);
			},
		},
	);

	const completionDisposable = vscode.languages.registerCompletionItemProvider(
		"wrd",
		{
			provideCompletionItems(document, position, _token) {
				return completion(document, position);
			},
		},
	);

	context.subscriptions.push(hoverDisposable);
	context.subscriptions.push(definitionDisposable);
	context.subscriptions.push(completionDisposable);
}

export function deactivate() {}
