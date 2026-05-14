import { outputChannel } from "./extension";

export namespace Logger {
	export function info(message: string) {
		outputChannel.appendLine(message);
	}
}
