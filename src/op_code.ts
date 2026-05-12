import fs from "node:fs";
import YAML from "yaml";

const opCodesFile = fs.readFileSync("src/docs/op_codes.wrd.yaml", "utf-8");
let opCodes = YAML.parse(opCodesFile);

export function recomputeOpCodes(newOpCodesFile: string) {
	opCodes = YAML.parse(newOpCodesFile);
}

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
			const v = value as Value;
			if ("Type" in v) {
				return `*@${key}*: \`${v.Type}\` — ${v.Description}`;
			}
			return `*@${key}*: \`${v.Items.join(" | ")}\` — ${v.Description}`;
		});
}

export function extractArgs(opCode: string) {
	return Object.entries(opCodes[opCode])
		.filter(([key, _value]) => key !== "Description")
		.map(([_key, value]) => {
			const v = value as Value;
			return v;
		});
}

export function getOpCodes() {
	return Object.entries(opCodes).map(([key, _value]) => key);
}

type Value =
	| {
			Type: "string" | "number" | "any";
			Description: string;
	  }
	| {
			Description: string;
			Items: string[];
	  }
	| {
			Type: "string" | "number" | "any";
			Description: string;
			Items: string[];
	  };
