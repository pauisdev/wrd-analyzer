import * as vscode from "vscode";
import { extractArgs, isOpCode } from "./op_code";

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
		const helper = new DiagnosticHelper(document, i);
		const line = lines[i].trimEnd();

		if (line.trim() !== line) {
			const extraStartingPadding = line.length - line.trim().length;
			helper.error("Extra padding should be removed", 0, extraStartingPadding);
			continue;
		}
		if (!line.startsWith("<")) {
			helper.error("Missing starting '<' bracket", 0, 1);
			continue;
		}
		if (!line.endsWith(">")) {
			helper.error("Missing ending '>' bracket", line.length, line.length);
			continue;
		}
		const [opCode, ...args] = line.slice(1, -1).split(" ");
		if (!isOpCode(opCode)) {
			helper.error("Unknown OP CODE.", 0, opCode.length);
		}
	}
}

class DiagnosticHelper {
	private document;
	private line;

	constructor(document: vscode.TextDocument, line: number) {
		this.document = document;
		this.line = line;
	}

	error(message: string, start: number, end: number) {
		addDiagnostic(
			this.document,
			new vscode.Range(
				new vscode.Position(this.line, start),
				new vscode.Position(this.line, end),
			),
			message,
			vscode.DiagnosticSeverity.Error,
		);
	}
}
