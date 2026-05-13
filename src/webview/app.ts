const style = document.createElement('style');
style.textContent = `
    @keyframes chomp-clip {
        0% { clip-path: polygon(100% 50%, 50% 50%, 100% 50%, 100% 100%, 0 100%, 0 0, 100% 0); }
        50% { clip-path: polygon(100% 25%, 50% 50%, 100% 75%, 100% 100%, 0 100%, 0 0, 100% 0); }
        100% { clip-path: polygon(100% 50%, 50% 50%, 100% 50%, 100% 100%, 0 100%, 0 0, 100% 0); }
    }
    .pacman {
        width: 30px;
        height: 30px;
        background-color: #FFCC00;
        border-radius: 50%;
        position: absolute;
        bottom: 10px;
        animation: chomp-clip 0.3s infinite;
    }
    .pacman-eye {
        width: 4px;
        height: 4px;
        background-color: #000;
        border-radius: 50%;
        position: absolute;
        top: 6px;
        right: 12px;
    }
`;
document.head.appendChild(style);

const container = document.getElementById('pacman-container');
let isRunning = false;
let pacman: HTMLDivElement | null = null;
let ghosts: HTMLDivElement[] = [];
let speed = 5;
let position = -60;
let ghostsEnabled = false;

function createPacman() {
    if (pacman) return;
    pacman = document.createElement('div');
    pacman.className = 'pacman';
    
    const eye = document.createElement('div');
    eye.className = 'pacman-eye';
    pacman.appendChild(eye);

    container?.appendChild(pacman);
}

const svgGhost = (color: string) => `
<svg viewBox="0 0 100 100" width="30" height="30">
    <path d="M 10 100 L 10 40 A 40 40 0 0 1 90 40 L 90 100 L 76.6 90 L 63.3 100 L 50 90 L 36.6 100 L 23.3 90 Z" fill="${color}" />
    <circle cx="35" cy="40" r="10" fill="white" />
    <circle cx="65" cy="40" r="10" fill="white" />
    <circle cx="40" cy="40" r="4" fill="#0000AA" />
    <circle cx="70" cy="40" r="4" fill="#0000AA" />
</svg>
`;

function updateGhosts() {
    if (ghostsEnabled && ghosts.length === 0) {
        const colors = ['#FF0000', '#00FFFF', '#FFC0CB', '#FFB852']; // Blinky, Inky, Pinky, Clyde
        for (let i = 0; i < colors.length; i++) {
            const ghost = document.createElement('div');
            ghost.style.position = 'absolute';
            ghost.style.bottom = '10px';
            ghost.innerHTML = svgGhost(colors[i]);
            container?.appendChild(ghost);
            ghosts.push(ghost);
        }
    } else if (!ghostsEnabled && ghosts.length > 0) {
        ghosts.forEach(g => g.remove());
        ghosts = [];
    }
}

function animate() {
    if (!isRunning || !pacman) return;

    position += speed;
    if (position > window.innerWidth) {
        position = -250; // offset back for trailing ghosts
    }

    pacman.style.left = `${position}px`;
    
    ghosts.forEach((ghost, idx) => {
        const offset = 60 + (idx * 40); 
        ghost.style.left = `${Math.max(-60, position - offset)}px`;
    });

    requestAnimationFrame(animate);
}

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'start-animation':
            if (!isRunning) {
                isRunning = true;
                createPacman();
                updateGhosts();
                animate();
            }
            break;
        case 'stop-animation':
            isRunning = false;
            if (pacman) {
                pacman.remove();
                pacman = null;
            }
            ghosts.forEach(g => g.remove());
            ghosts = [];
            break;
        case 'update-config':
            speed = message.payload.speed || 5;
            ghostsEnabled = message.payload.ghostsEnabled || false;
            updateGhosts();
            break;
    }
});

// @ts-ignore
const vscodeApi = acquireVsCodeApi();
vscodeApi.postMessage({ command: 'ready' });
