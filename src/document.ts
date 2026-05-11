import type { TextDocument } from "vscode";

export function documentToLines(doc: TextDocument) {
	return doc
		.getText()
		.split("\n")
		.map((line) => line.trim());
}
