// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// === Hello World Command ===
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(
		'Congratulations, your extension "smart-comments" is now active!',
	);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand(
		"smart-comments.helloWorld",
		() => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			vscode.window.showInformationMessage("Hello World from Smart Comments ext!");
		},
	);
	context.subscriptions.push(disposable);

	// === Smart Comments: Comment out each jsx tag ===
	const commentEachTag = vscode.commands.registerCommand(
		"smart-comments.commentEachTag",
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			const document = editor.document;
			const selection = editor.selection;
			const selectedText = document.getText(selection);

			// Use a regex to find JSX tags
			const regex = /(<[^>]+>[\s\S]*?<\/[^>]+>)|(<[^>]+\/>)/g;
			const newText = selectedText.replace(regex, (match) => {
				return `{/* ${match} */}`;
			});

			editor.edit((editBuilder) => {
				editBuilder.replace(selection, newText);
			});
		},
	);
	context.subscriptions.push(commentEachTag);

	// === Smart Comments: Uncomment each jsx tag ===
	const uncommentEachTag = vscode.commands.registerCommand(
		"smart-comments.uncommentEachTag",
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			const document = editor.document;
			const selection = editor.selection;
			const selectedText = document.getText(selection);

			// Regex to find commented tags
			const regex = /\{\/\*\s*(<[^>]+>[\s\S]*?<\/[^>]+>|<[^>]+\/>)\s*\*\/\}/g;
			const newText = selectedText.replace(regex, (match, p1) => {
				return p1;
			});

			editor.edit((editBuilder) => {
				editBuilder.replace(selection, newText);
			});
		},
	);
	context.subscriptions.push(uncommentEachTag);

	// === Smart Comments: Uncomment first-level tag only ===
	const uncommentFirstLevelTag = vscode.commands.registerCommand(
		"smart-comments.uncommentFirstLevelTag",
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			const document = editor.document;
			const selection = editor.selection;
			const selectedText = document.getText(selection);

			// Find only the first-level commented tags
			const regex = /^\s*\{\/\*\s*(<[^>]+>)\s*\*\/\}/m;
			const closingTagRegex = /^\s*\{\/\*\s*(<\/[^>]+>)\s*\*\/\}/m;

			let newText = selectedText;

			// Uncomment opening tag
			newText = newText.replace(regex, (match, p1) => {
				return p1;
			});

			// Uncomment closing tag
			newText = newText.replace(closingTagRegex, (match, p1) => {
				return p1;
			});

			editor.edit((editBuilder) => {
				editBuilder.replace(selection, newText);
			});
		},
	);
	context.subscriptions.push(uncommentFirstLevelTag);
}

// This method is called when your extension is deactivated
export function deactivate() {}
