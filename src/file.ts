import fs from "node:fs";
import path from "node:path";

export function createConfigFiles(folderPath: string) {
	const originalOpCodesFile = fs.readFileSync(
		"src/docs/op_codes.wrd.yaml",
		"utf-8",
	);
	const originalValuesFile = fs.readFileSync(
		"src/docs/values.wrd.yaml",
		"utf-8",
	);
	const opOutFile = path.join(folderPath, "op_codes.wrd.yaml");
	const valuesOutFile = path.join(folderPath, "values.wrd.yaml");
	fs.writeFileSync(opOutFile, originalOpCodesFile);
	fs.writeFileSync(valuesOutFile, originalValuesFile);
}

export function readConfigFiles(folderPath: string) {
	return {
		opCodesFile: readConfigOpCodeFile(folderPath),
		valuesFile: readConfigValuesFile(folderPath),
	};
}

export function readConfigValuesFile(folderPath: string) {
	try {
		const filePath = path.join(folderPath, "values.wrd.yaml");
		return fs.readFileSync(filePath, "utf-8");
	} catch {
		return undefined;
	}
}

export function readConfigOpCodeFile(folderPath: string) {
	try {
		const filePath = path.join(folderPath, "op_codes.wrd.yaml");
		return fs.readFileSync(filePath, "utf-8");
	} catch {
		return undefined;
	}
}
