# Protocol: Webview Messages

This project is a VS Code extension that uses a Webview Panel to render the Pac-Man animation. Communication between the extension host (Node.js) and the Webview (Frontend JS) occurs via the `acquireVsCodeApi().postMessage()` and `webview.postMessage()` APIs.

## Host to Webview Messages

Sent from `src/WebviewManager.ts` to `src/webview/app.ts`.

```typescript
type MessageToWebview = 
  | { command: 'start-animation' }
  | { command: 'stop-animation' }
  | { command: 'update-config', payload: { speed: number; ghostsEnabled: boolean } };
```

## Webview to Host Messages

Sent from the Webview back to the host extension context.

```typescript
type MessageFromWebview = 
  | { command: 'animation-error', payload: { errorMsg: string } }
  | { command: 'ready' }; // signals webview DOM is loaded and ready for commands
```
