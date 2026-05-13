import * as vscode from 'vscode';

export class PacmanViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'pacman-extension.view';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'dist'),
                vscode.Uri.joinPath(this._extensionUri, 'assets')
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'ready':
                    this.syncConfig();
                    this._view?.webview.postMessage({ command: 'start-animation' });
                    break;
            }
        });

        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('pacman-extension')) {
                this.syncConfig();
            }
        });
    }

    private syncConfig() {
        if (!this._view) return;
        const config = vscode.workspace.getConfiguration('pacman-extension');
        const speed = config.get<number>('speed', 5);
        const ghostsEnabled = config.get<boolean>('enableGhosts', false);

        this._view.webview.postMessage({
            command: 'update-config',
            payload: { speed, ghostsEnabled }
        });
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
                    body, html { 
                        margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; 
                    }
                    body {
                        background-color: #0b0c10;
                        background-image: 
                            radial-gradient(white, rgba(255,255,255,.3) 1px, transparent 2px),
                            radial-gradient(white, rgba(255,255,255,.2) 1px, transparent 2px),
                            radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 2px);
                        background-size: 150px 150px, 100px 100px, 200px 200px;
                        background-position: 0 0, 40px 60px, 130px 100px;
                    }
                    #pacman-container {
                        position: absolute;
                        bottom: 0px;
                        left: 0px;
                        width: 100%;
                        height: 64px;
                        pointer-events: none;
                    }
                </style>
            </head>
            <body>
                <div id="pacman-container"></div>
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
