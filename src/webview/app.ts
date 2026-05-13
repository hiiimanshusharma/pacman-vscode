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
    pacman.style.width = '0';
    pacman.style.height = '0';
    pacman.style.border = '30px solid #FFCC00';
    pacman.style.borderRightColor = 'transparent';
    pacman.style.borderRadius = '50%';
    pacman.style.position = 'absolute';
    pacman.style.bottom = '2px';
    pacman.style.transition = 'none';

    setInterval(() => {
        if (!pacman) return;
        pacman.style.borderRightColor = (pacman.style.borderRightColor === 'transparent') ? '#FFCC00' : 'transparent';
    }, 200);

    container?.appendChild(pacman);
}

function updateGhosts() {
    if (ghostsEnabled && ghosts.length === 0) {
        const colors = ['#FF0000', '#00FFFF', '#FFC0CB', '#FFB852']; // Blinky, Inky, Pinky, Clyde
        for (let i = 0; i < colors.length; i++) {
            const ghost = document.createElement('div');
            ghost.style.width = '30px';
            ghost.style.height = '30px';
            ghost.style.backgroundColor = colors[i];
            ghost.style.borderTopLeftRadius = '15px';
            ghost.style.borderTopRightRadius = '15px';
            ghost.style.position = 'absolute';
            ghost.style.bottom = '2px';
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
        position = -250; // offset back for trailing
    }

    pacman.style.left = `${position}px`;
    
    ghosts.forEach((ghost, idx) => {
        const offset = 60 + (idx * 45); 
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
