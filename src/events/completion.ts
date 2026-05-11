import * as vscode from "vscode";
import { documentToLines } from "../document";
import { extractArgs, getOpCodes } from "../op_code";
import { cursorPositionToWordIndex, wordWithoutBrackets } from "../word";

export default (
	document: vscode.TextDocument,
	position: vscode.Position,
): vscode.ProviderResult<
	vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>
> => {
	const lines = documentToLines(document);
	const line = lines[position.line].split(" ");
	const wordIndex = cursorPositionToWordIndex(line, position.character);
	if (wordIndex === undefined) return;
	if (wordIndex === 0) {
		return {
			items: getOpCodes().map((item) => new vscode.CompletionItem(item)),
			isIncomplete: false,
		};
	}

	const opCode = wordWithoutBrackets(line[0]);
	if (!opCode) return;

	const args = extractArgs(opCode);
	const argsForCurrentWord = args[wordIndex - 1];
	if ("Items" in argsForCurrentWord) {
		return {
			items: argsForCurrentWord.Items.map(
				(item) => new vscode.CompletionItem(item),
			),
			isIncomplete: false,
		};
	}
	return;
};
