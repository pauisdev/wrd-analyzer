import YAML from "yaml";

let opCodes: any = {};

export function recomputeOpCodes(newOpCodesFile: string) {
	opCodes = YAML.parse(newOpCodesFile);
	for (const opCode in opCodes) {
		if ("...Args" in opCodes[opCode]) {
			for (let i = 0; i < 100; i++) {
				opCodes[opCode][`_Args${i}`] = opCodes[opCode]["...Args"];
			}
		}
	}
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
			if (key.startsWith("_")) return "";
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
			Type: "string" | "number";
			Description: string;
	  }
	| {
			Description: string;
			Items: string[];
	  }
	| {
			Type: "string" | "number";
			Description: string;
			Items: string[];
	  };
