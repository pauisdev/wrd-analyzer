import fs from "node:fs";
import path from "node:path";

export function copyThemeInto(extensionPath: string, to: string) {
	const themePath = path.join(extensionPath, "resources", "settings.json");
	const themeSettings = fs.readFileSync(themePath, "utf-8");
	const dir = path.dirname(to); // .vscode folder
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	fs.writeFileSync(to, themeSettings);
}
