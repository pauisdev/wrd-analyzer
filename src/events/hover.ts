import type * as vscode from "vscode";
import { documentToLines } from "../document";
import { isOpCode, opCodeToFormattedDocs } from "../op_code";
import { isValue, valueDocumentation } from "../values";
import { getOpCodeFromLine, getWordAt, wordWithoutBrackets } from "../word";

export default (
	document: vscode.TextDocument,
	position: vscode.Position,
): vscode.ProviderResult<vscode.Hover> => {
	const lines = documentToLines(document);
	const currentLine = lines[position.line];
	const currentWord = wordWithoutBrackets(
		getWordAt(currentLine, position.character),
	);
	if (!currentWord) return;
	if (isOpCode(currentWord)) {
		return opCodeToFormattedDocs(currentWord);
	}

	if (isValue(currentWord)) {
		const opCode = getOpCodeFromLine(currentLine);
		const valueDocs = valueDocumentation(currentWord, opCode);
		return {
			contents: [valueDocs],
		};
	}
};
