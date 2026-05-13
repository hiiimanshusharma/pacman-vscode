import * as vscode from 'vscode';
import { WebviewManager } from './WebviewManager';

export function activate(context: vscode.ExtensionContext) {
    console.log('Pac-Man extension is now active!');

    let startDisposable = vscode.commands.registerCommand('pacman-extension.startSession', () => {
        WebviewManager.createOrShow(context.extensionUri);
        // Dispatch 'start-animation' so frontend begins loop after it is "ready". Ideally frontend calls "ready" first, which we handle.
    });

    let stopDisposable = vscode.commands.registerCommand('pacman-extension.stopSession', () => {
        WebviewManager.stop();
    });

    context.subscriptions.push(startDisposable, stopDisposable);
}

export function deactivate() {
    WebviewManager.stop();
}
