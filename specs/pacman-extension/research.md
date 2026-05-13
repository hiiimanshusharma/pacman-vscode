# Research Findings: Pac-Man VS Code Extension

## Webview Panel vs Standard Editor UI
- **Decision**: Use VS Code Webview Panel configured as an editor column display.
- **Rationale**: VS Code's extension API strictly forbids overlaying arbitrary DOM elements onto the editor workspace. The Webview API is the only supported way to render HTML/JS/CSS, which is required for custom animations and sprite rendering.
- **Alternatives considered**: TextEditorDecorations (too hacky, limited to font characters/background colors), Status Bar Items (too small, no physics/animation context).

## Animation Strategy inside Webview
- **Decision**: Use standard CSS/JS requestAnimationFrame or a lightweight 2D canvas architecture.
- **Rationale**: Minimizes dependencies and ensures low resource utilization.
- **Alternatives considered**: Including heavy physics engines like Matter.js or Phaser.js (overkill for simple horizontal traversal).
