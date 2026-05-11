import * as vscode from "vscode";
import completion from "./events/completion";
import definition from "./events/definition";
import hover from "./events/hover";

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("WRD Analyzer started!");

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
