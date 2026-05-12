import fs from "node:fs";
import YAML from "yaml";

export const valuesFile = fs.readFileSync("src/docs/values.wrd.yaml", "utf-8");
const values = YAML.parse(valuesFile);

export function isValue(str: string) {
	return str in values;
}

export function valueDocumentation(value: string, forOpCode: string) {
	const data = values[value];
	if (typeof data === "string") return data;
	const docsForOpCode = data[forOpCode] as string | undefined;
	if (!docsForOpCode) return data.Default as string;
	return docsForOpCode;
}
