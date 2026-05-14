import * as vscode from "vscode";

let diagnosticsCollection: vscode.DiagnosticCollection;

export function setDiagnosticsCollection(
	collection: vscode.DiagnosticCollection,
) {
	diagnosticsCollection = collection;
}

function addDiagnostic(
	document: vscode.TextDocument,
	range: vscode.Range,
	message: string,
	severity: vscode.DiagnosticSeverity,
) {
	const diagnostic = new vscode.Diagnostic(range, message, severity);
	const currentDiagnostics = diagnosticsCollection.get(document.uri);
	const diagnostics = currentDiagnostics
		? [...currentDiagnostics, diagnostic]
		: [diagnostic];
	diagnosticsCollection.set(document.uri, diagnostics);
}

export function updateDiagnostics(document: vscode.TextDocument) {
	diagnosticsCollection.delete(document.uri);

	const lines = document.getText().split("\n");
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trimEnd();
		if (line.trim() !== line) {
			const extraStartingPadding = line.length - line.trim().length;
			addDiagnostic(
				document,
				new vscode.Range(
					new vscode.Position(i, 0),
					new vscode.Position(i, extraStartingPadding),
				),
				"Extra padding should be removed",
				vscode.DiagnosticSeverity.Error,
			);
		}
		if (!line.startsWith("<")) {
			addDiagnostic(
				document,
				new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, 1)),
				"Missing starting '<' bracket",
				vscode.DiagnosticSeverity.Error,
			);
		}
		if (!line.endsWith(">")) {
			addDiagnostic(
				document,
				new vscode.Range(
					new vscode.Position(i, line.length),
					new vscode.Position(i, line.length),
				),
				"Missing ending '>' bracket",
				vscode.DiagnosticSeverity.Error,
			);
		}
	}
}
