import * as vscode from "vscode";
import completion from "./events/completion";
import definition from "./events/definition";
import hover from "./events/hover";
import { createConfigFiles, readConfigFiles } from "./file";
import { recomputeOpCodes } from "./op_code";
import { recomputeValuesFile } from "./values";

export function activate(context: vscode.ExtensionContext) {
	const workspace = vscode.workspace.workspaceFolders?.at(0);
	if (!workspace) return;
	const configFiles = readConfigFiles(workspace.uri.fsPath);
	if (configFiles.opCodesFile) {
		recomputeOpCodes(configFiles.opCodesFile);
	}
	if (configFiles.valuesFile) {
		recomputeValuesFile(configFiles.valuesFile);
	}
	if (configFiles.opCodesFile || configFiles.valuesFile) {
		vscode.window.showInformationMessage(
			"Detected and loaded config files in current workspace.",
		);
	}

	vscode.window.showInformationMessage("WRD Analyzer started!");

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
	context.subscriptions.push(createConfigFilesCommandDisposable);
}

export function deactivate() {}
