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
}
