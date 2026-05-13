import YAML from "yaml";

let values: any = {};

export function recomputeValuesFile(newValuesFile: string) {
	values = YAML.parse(newValuesFile);
}

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
