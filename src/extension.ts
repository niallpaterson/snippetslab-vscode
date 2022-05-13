// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as transformers from './transformers';
import type { SnippetLabLib } from './transformers';
import * as fs from 'fs';

const path =
	'/Users/niallbiglemon/prog/np/snippetslab/src/data/sl-snippets.json';

const fetchSnippets = async () => {
	try {
		const snippets = await fs.promises.readFile(path, 'utf-8');
		return snippets;
	} catch (e) {
		console.error(e);
	}
};
// TODO: use onLanguage to filter the snippets

export function activate(context: vscode.ExtensionContext) {
	const trigger = '~';
	const register = vscode.languages.registerCompletionItemProvider(
		'*',
		{
			async provideCompletionItems(document, position) {
				const response = await fetchSnippets();

				if (response) {
					const lib = JSON.parse(response) as SnippetLabLib;
					const snippets = transformers.transformSnippetsLab(lib);
					return snippets.map(
						(snippet) =>
							<vscode.CompletionItem>{
								label: snippet.label,
								insertText: new vscode.SnippetString(snippet.body),
								kind: vscode.CompletionItemKind.Snippet,
								additionalTextEdits: [
									vscode.TextEdit.delete(
										new vscode.Range(
											position.with(position.line, position.character - 1),
											position
										)
									),
								],
							}
					);
				}
			},
		},
		trigger
	);

	context.subscriptions.push(register);
}

// this method is called when your extension is deactivated
export function deactivate() {}
