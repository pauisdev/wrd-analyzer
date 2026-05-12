import fs from "node:fs";
import path from "node:path";
import { opCodesFile } from "./op_code";
import { valuesFile } from "./values";

export function createConfigFiles(folderPath: string) {
	const opOutFile = path.join(folderPath, "op_codes.wrd.yaml");
	const valuesOutFile = path.join(folderPath, "values.wrd.yaml");
	fs.writeFileSync(opOutFile, opCodesFile);
	fs.writeFileSync(valuesOutFile, valuesFile);
}
