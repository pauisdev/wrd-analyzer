import fs from "node:fs";
import path from "node:path";
import * as vscode from "vscode";
import { setDiagnosticsCollection, updateDiagnostics } from "./diagnostics";
import completion from "./events/completion";
import definition from "./events/definition";
import hover from "./events/hover";
import { createConfigFiles, readConfigFiles } from "./file";
import { Logger } from "./logger";
import { recomputeOpCodes } from "./op_code";
import { copyThemeInto } from "./theme";
import { recomputeValuesFile } from "./values";

export function activate(context: vscode.ExtensionContext) {
	const workspace = vscode.workspace.workspaceFolders?.at(0);
	if (workspace) {
		const configFiles = readConfigFiles(workspace.uri.fsPath);
		if (configFiles.opCodesFile) {
			recomputeOpCodes(configFiles.opCodesFile);
		} else {
			const originalOpCodesFile = fs.readFileSync(
				path.join(
					context.extension.extensionPath,

					"docs",
					"op_codes.wrd.yaml",
				),
				"utf-8",
			);
			recomputeOpCodes(originalOpCodesFile);
		}
		if (configFiles.valuesFile) {
			recomputeValuesFile(configFiles.valuesFile);
		} else {
			const originalValuesFile = fs.readFileSync(
				path.join(context.extension.extensionPath, "docs", "values.wrd.yaml"),
				"utf-8",
			);
			recomputeValuesFile(originalValuesFile);
		}
		if (configFiles.opCodesFile || configFiles.valuesFile) {
			vscode.window.showInformationMessage(
				"Detected and loaded config files in current workspace.",
			);
		}
	}

	const diagnosticsCollection =
		vscode.languages.createDiagnosticCollection("wrd-analyzer");
	context.subscriptions.push(diagnosticsCollection);
	setDiagnosticsCollection(diagnosticsCollection);

	const currentDocument = vscode.window.activeTextEditor?.document;
	if (currentDocument) {
		runDiagnosticsIfDocumentIsWrd(currentDocument);
	}

	const statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		0,
	);

	const showLogsCommandId = "wrd-analyzer.show-logs";
	vscode.commands.registerCommand(showLogsCommandId, () => {
		Logger.showConsole();
	});

	statusBar.text = `$(coffee) WRD`;
	statusBar.command = showLogsCommandId;
	statusBar.tooltip = "Show logs";
	statusBar.show();

	context.subscriptions.push(
		vscode.workspace.onDidOpenTextDocument((doc) =>
			runDiagnosticsIfDocumentIsWrd(doc),
		),
		vscode.workspace.onDidChangeTextDocument((event) =>
			runDiagnosticsIfDocumentIsWrd(event.document),
		),
		vscode.commands.registerCommand("wrd-analyzer.setup-theme", () => {
			if (!workspace) {
				vscode.window.showErrorMessage(
					"Not inside a workspace. Can't setup theme here.",
				);
				return;
			}
			const to = path.join(workspace.uri.fsPath, ".vscode", "settings.json");
			if (fs.existsSync(to)) {
				vscode.window.showErrorMessage(
					".vscode/settings.json file already exists. Can't proceed.",
				);
				return;
			}
			copyThemeInto(context.extension.extensionPath, to);
			vscode.window.showInformationMessage("Theme setup!");
			Logger.info("✅ Theme files setup.");
		}),
	);

	const createConfigFilesCommandDisposable = vscode.commands.registerCommand(
		"wrd-analyzer.create-config-files",
		() => {
			const workspace = vscode.workspace.workspaceFolders?.at(0);
			if (workspace === undefined) {
				vscode.window.showErrorMessage(
					"No workspace is open. Unable to create config files",
				);
				return;
			}
			createConfigFiles(context.extension.extensionPath, workspace.uri.fsPath);
			vscode.window.showInformationMessage("Config files created!");
		},
	);

	const hoverDisposable = vscode.languages.registerHoverProvider("wrd", {
		provideHover(document, position, _token) {
			return hover(document, position);
		},
	});

	const definitionDisposable = vscode.languages.registerDefinitionProvider(
		"wrd",
		{
			provideDefinition(document, position, _token) {
				return definition(document, position);
			},
		},
	);

	const completionDisposable = vscode.languages.registerCompletionItemProvider(
		"wrd",
		{
			provideCompletionItems(document, position, _token) {
				return completion(document, position);
			},
		},
	);

	context.subscriptions.push(hoverDisposable);
	context.subscriptions.push(definitionDisposable);
	context.subscriptions.push(completionDisposable);
	context.subscriptions.push(createConfigFilesCommandDisposable);

	Logger.info("✅ WRD Analyzer is ready.");
}

function runDiagnosticsIfDocumentIsWrd(document: vscode.TextDocument) {
	if (document.languageId === "wrd") {
		updateDiagnostics(document);
	}
}

export function deactivate() {}
