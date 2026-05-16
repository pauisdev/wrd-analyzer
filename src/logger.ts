import * as vscode from "vscode";

export namespace Logger {
	const outputChannel = vscode.window.createOutputChannel("WRD Analyzer", {
		log: true,
	});

	export function showConsole() {
		outputChannel.show();
	}

	export function info(message: string) {
		outputChannel.appendLine(message);
	}
}
