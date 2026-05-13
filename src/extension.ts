import * as vscode from 'vscode';
import { PacmanViewProvider } from './PacmanViewProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Pac-Man extension is now active!');

    const provider = new PacmanViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(PacmanViewProvider.viewType, provider)
    );

    let startDisposable = vscode.commands.registerCommand('pacman-extension.startSession', () => {
        vscode.commands.executeCommand('pacman-extension.view.focus');
    });

    context.subscriptions.push(startDisposable);
}

export function deactivate() { }
