import fs from "node:fs";
import YAML from "yaml";

const opCodesFiles = fs.readFileSync("src/docs/op_codes.wrd.yaml", "utf-8");
const opCodes = YAML.parse(opCodesFiles);

export function opCodeToFormattedDocs(possibleOpCode: string) {
	if (!opCodes[possibleOpCode]) return;
	const documentation = opCodes[possibleOpCode].Description;
	const args = formatArgs(possibleOpCode);
	return {
		contents: [`### Opcode ${possibleOpCode}`, documentation, ...args],
	};
}

function formatArgs(opCode: string) {
	return Object.entries(opCodes[opCode])
		.filter(([key, _value]) => key !== "Description")
		.map(([key, value]) => {
			return `*@${key}*: \`${value}\``;
		});
}
