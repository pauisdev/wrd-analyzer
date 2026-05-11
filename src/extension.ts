import fs from "node:fs";
import * as vscode from "vscode";
import YAML from "yaml";

const opCodesFiles = fs.readFileSync("src/docs/op_codes.wrd.yaml", "utf-8");
const opCodes = YAML.parse(opCodesFiles);

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("WRD Analyzer started!");

	vscode.languages.registerHoverProvider("wrd", {
		provideHover(document, position, _token) {
			const lines = document
				.getText()
				.split("\n")
				.map((line) => line.trim());
			const currentLine = lines[position.line];
			const isHoveringOverOpCode = position.character <= 4;
			if (isHoveringOverOpCode) {
				const opCode = currentLine.slice(1, 4);
				const documentation = opCodes[opCode]["Description"];
				return {
					contents: [documentation],
				};
			}
			return;
		},
	});

	const definitionDisposable = vscode.languages.registerDefinitionProvider(
		"wrd",
		{
			provideDefinition(document, position, _token) {
				const lines = document
					.getText()
					.split("\n")
					.map((line) => line.trim());
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
			},
		},
	);

	context.subscriptions.push(definitionDisposable);
}

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

export function deactivate() {}
