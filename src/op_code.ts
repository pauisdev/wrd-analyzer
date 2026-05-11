import fs from "node:fs";
import YAML from "yaml";

const opCodesFiles = fs.readFileSync("src/docs/op_codes.wrd.yaml", "utf-8");
const opCodes = YAML.parse(opCodesFiles);

export function isOpCode(code: string) {
	return code in opCodes;
}

export function opCodeToFormattedDocs(code: string) {
	const documentation = opCodes[code].Description;
	const args = formatArgs(code);
	return {
		contents: [`### Opcode ${code}`, documentation, ...args],
	};
}

function formatArgs(opCode: string) {
	return Object.entries(opCodes[opCode])
		.filter(([key, _value]) => key !== "Description")
		.map(([key, value]) => {
			return `*@${key}*: \`${value}\``;
		});
}
