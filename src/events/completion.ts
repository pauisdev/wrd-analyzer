import * as vscode from "vscode";

export default (
	document: vscode.TextDocument,
	position: vscode.Position,
): vscode.ProviderResult<
	vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>
> => {
	return {
		items: [
			new vscode.CompletionItem("Example"),
			new vscode.CompletionItem("Another option"),
			new vscode.CompletionItem("AAA"),
		],
		isIncomplete: true,
	};
};
