import * as vscode from 'vscode';

export class WebviewManager {
    public static currentPanel: WebviewManager | undefined;
    public readonly webviewPanel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (WebviewManager.currentPanel) {
            WebviewManager.currentPanel.webviewPanel.reveal(column);
            WebviewManager.currentPanel.webviewPanel.webview.postMessage({ command: 'start-animation' });
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'pacmanExtension',
            'Pac-Man',
            vscode.ViewColumn.Beside, // usually bottom or beside makes sense for custom panel not blocking code
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist'), vscode.Uri.joinPath(extensionUri, 'assets')],
                retainContextWhenHidden: true
            }
        );

        WebviewManager.currentPanel = new WebviewManager(panel, extensionUri);
    }

    public static stop() {
        if (WebviewManager.currentPanel) {
            WebviewManager.currentPanel.dispose();
        }
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.webviewPanel = panel;
        this._extensionUri = extensionUri;

        this._update();
        this.webviewPanel.onDidDispose(() => this.dispose(), null, this._disposables);

        this.webviewPanel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'ready':
                        this.syncConfig();
                        this.webviewPanel.webview.postMessage({ command: 'start-animation' });
                        return;
                    case 'animation-error':
                        vscode.window.showErrorMessage(message.payload.errorMsg);
                        return;
                }
            },
            null,
            this._disposables
        );

        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('pacman-extension')) {
                this.syncConfig();
            }
        }, null, this._disposables);
    }

    private syncConfig() {
        const config = vscode.workspace.getConfiguration('pacman-extension');
        const speed = config.get<number>('speed', 5);
        const ghostsEnabled = config.get<boolean>('enableGhosts', false);

        this.webviewPanel.webview.postMessage({
            command: 'update-config',
            payload: { speed, ghostsEnabled }
        });
    }

    public dispose() {
        WebviewManager.currentPanel = undefined;
        this.webviewPanel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        const webview = this.webviewPanel.webview;
        this.webviewPanel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview', 'app.js'));
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Pac-Man</title>
                <style>
                    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
                    #pacman-container {
                        position: absolute;
                        bottom: 0px;
                        left: 0px;
                        width: 100%;
                        height: 64px;
                        pointer-events: none; /* Let clicks pass through if overlapping editor */
                    }
                </style>
            </head>
            <body>
                <div id="pacman-container"></div>
                <script nonce="${nonce}">
                    const vscode = acquireVsCodeApi();
                </script>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
