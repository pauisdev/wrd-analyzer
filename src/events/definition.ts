import * as vscode from "vscode";
import { documentToLines } from "../document";

export default (
	document: vscode.TextDocument,
	position: vscode.Position,
): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> => {
	const lines = documentToLines(document);
	const currentLine = lines[position.line];

	const jumpFromTo = {
		JMN: "LBN",
		JMP: "LAB",
	};
	const range = Object.entries(jumpFromTo)
		.map(([jmpLabel, lbnLabel]) =>
			jumpToDefinition({ lines, currentLine, jmpLabel, lbnLabel }),
		)
		.filter((range) => range !== undefined)
		.at(0);
	if (!range) return undefined;
	return {
		uri: document.uri,
		range,
	};
};

interface FileInfo {
	lines: string[];
	currentLine: string;
}

interface JumpToDefiniton extends FileInfo {
	jmpLabel: string;
	lbnLabel: string;
}

function jumpToDefinition({
	lines,
	currentLine,
	jmpLabel,
	lbnLabel,
}: JumpToDefiniton) {
	const result = new RegExp(`<${jmpLabel} ([a-zA-Z0-9_]+)>`).exec(currentLine);
	if (result === null) return;
	const [_, id] = result;
	const definitionToSearch = `<${lbnLabel} ${id}>`;
	const definitionLine = lines.indexOf(definitionToSearch);
	if (definitionLine === -1) {
		vscode.window.showErrorMessage(`${lbnLabel} id ${id} not found.`);
		return;
	}
	const definitionLength = definitionToSearch.length;

	const start = new vscode.Position(definitionLine, 0);
	const end = new vscode.Position(definitionLine, definitionLength);
	return new vscode.Range(start, end);
}
