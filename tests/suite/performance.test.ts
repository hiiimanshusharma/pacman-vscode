import * as assert from 'assert';
import * as vscode from 'vscode';
import { WebviewManager } from '../../src/WebviewManager';

suite('Performance Test Suite', () => {
    vscode.window.showInformationMessage('Starting performance checks.');

    test('Webview initializes quickly (< 3 seconds)', async () => {
        const start = Date.now();
        await vscode.commands.executeCommand('pacman-extension.startSession');
        
        // Let event loop catch up
        await new Promise(resolve => setTimeout(resolve, 500));
        
        assert.ok(WebviewManager.currentPanel !== undefined, 'Panel should be created');
        
        const duration = Date.now() - start;
        assert.ok(duration < 3000, `Initialization took ${duration}ms, which exceeds 3000ms limit`);
        
        await vscode.commands.executeCommand('pacman-extension.stopSession');
    });
});
