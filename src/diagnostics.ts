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
			continue;
		}
		const correctArgs = extractArgs(opCode);
		const start = opCode.length + 2; // 2 because '<' + the space after the OP CODE

		let lettersRead = start;
		for (let n = 0; n < args.length; n++) {
			const insertedArg = args[n];
			const expectedArg = correctArgs.at(n);
			if (expectedArg === undefined) {
				helper.error(
					"Received more arguments than expected.",
					lettersRead,
					line.length,
				);
				break;
			}

			if ("Type" in expectedArg) {
				const type = expectedArg.Type;
				if (type === "string") continue;

				if (!isNum(insertedArg)) {
					helper.error(
						"Expected 'number' but found 'string'",
						lettersRead,
						lettersRead + insertedArg.length,
					);
				}

				continue;
			}

			lettersRead += insertedArg.length + 1;
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

function isNum(text: string) {
	return /^[0-9]+$/.test(text);
}
