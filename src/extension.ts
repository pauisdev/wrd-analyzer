import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("WRD Analyzer started!");

	const definitionDisposable = vscode.languages.registerDefinitionProvider(
		"plaintext",
		{
			provideDefinition(document, position, _token) {
				const lines = document
					.getText()
					.split("\n")
					.map((line) => line.trim());
				const currentLine = lines[position.line];
				const result = /<JMN ([0-9]+)>/.exec(currentLine);
				if (result === null) return;
				const [_, id] = result;
				const definitionToSearch = `<LBN ${id}>`;
				const definitionLine = lines.indexOf(definitionToSearch);
				if (definitionLine === -1) {
					vscode.window.showErrorMessage(`Label id ${id} not found.`);
					return;
				}
				const definitionLength = definitionToSearch.length;

				const start = new vscode.Position(definitionLine, 0);
				const end = new vscode.Position(definitionLine, definitionLength);
				return {
					uri: document.uri,
					range: new vscode.Range(start, end),
				};
			},
		},
	);

	context.subscriptions.push(definitionDisposable);
}

export function deactivate() {}
