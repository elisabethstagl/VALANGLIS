const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

const playerImg = new Image();
playerImg.src = './images/platformer-game/pixel-pete.png';

let level = 1;
let gameStarted = false;
let gravity = 0.5;
let keys = {};

let player = {
    x: 50,
    y: 0,
    width: 70,    // set this based on the actual width of the SVG
    height: 120,   // proportionally larger than width
    velocityX: 0,
    velocityY: 0,
    speed: 4,
    jumpStrength: -12,
    onGround: false,
    jumpCount: 0,
    maxJumps: 2
};

let worldOffset = 0;
let blocks = [];
let goal = { x: 1900, y: 420, width: 30, height: 50 };
let levelEndX = 2000;

function createLevel() {
    blocks = [];
    let blockCount = 80;
    for (let i = 0; i < blockCount; i++) {
        let x = i * 50;
        blocks.push({ x, y: 450, width: 50, height: 50 });
    }
    if (level === 1) {
        blocks.push({ x: 300, y: 370, width: 100, height: 20 });
        blocks.push({ x: 600, y: 300, width: 100, height: 20 });
        blocks.push({ x: 900, y: 250, width: 100, height: 20 });
    } else if (level === 2) {
        blocks.push({ x: 400, y: 350, width: 150, height: 20 });
        blocks.push({ x: 800, y: 300, width: 100, height: 20 });
        blocks.push({ x: 1200, y: 200, width: 100, height: 20 });
        blocks.push({ x: 1500, y: 270, width: 150, height: 20 });
    }
    player.x = 50;
    player.y = 0;
    player.velocityY = 0;
    player.jumpCount = 0;
    worldOffset = 0;
}

function drawPlayer() {
    ctx.drawImage(playerImg, player.x - worldOffset, player.y, player.width, player.height);
}

function drawBlocks() {
    ctx.fillStyle = '#6a040f';
    blocks.forEach(b => ctx.fillRect(b.x - worldOffset, b.y, b.width, b.height));

    ctx.fillStyle = 'gold';
    ctx.fillRect(goal.x - worldOffset, goal.y, goal.width, goal.height);
}

function updatePlayer() {
    player.velocityY += gravity;
    player.y += player.velocityY;
    player.velocityX = 0;

    if ((keys['ArrowLeft'] || keys['a']) && player.x > 0) player.velocityX = -player.speed;
    if ((keys['ArrowRight'] || keys['d']) && player.x + player.width < levelEndX) player.velocityX = player.speed;

    player.x += player.velocityX;

    player.onGround = false;
    blocks.forEach(b => {
        if (
            player.x + player.width > b.x &&
            player.x < b.x + b.width &&
            player.y + player.height > b.y &&
            player.y < b.y + b.height
        ) {
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= b.y) {
                player.y = b.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
                player.jumpCount = 0;
            }
        }
    });

    if (
        (keys[' '] || keys['w'] || keys['ArrowUp']) &&
        !keys['_jumpPressed'] &&
        player.jumpCount < player.maxJumps
    ) {
        player.velocityY = player.jumpStrength;
        player.jumpCount++;
        keys['_jumpPressed'] = true;
    }

    if (!keys[' '] && !keys['w'] && !keys['ArrowUp']) {
        keys['_jumpPressed'] = false;
    }

    if (
        player.x + player.width > goal.x &&
        player.x < goal.x + goal.width &&
        player.y + player.height > goal.y
    ) {
        level++;
        gravity += 0.1;
        createLevel();
    }

    if (player.y > canvas.height) {
        alert('Game Over! You fell.');
        document.location.reload();
    }

    const centerScreen = canvas.width / 2;
    if (player.x > centerScreen) {
        worldOffset = player.x - centerScreen;
    }
}

function gameLoop() {
    if (!gameStarted) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    drawBlocks();
    drawPlayer();
    hud.textContent = `Level: ${level}`;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }
    keys[e.key] = false;
});

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameStarted = true;
    createLevel();
    gameLoop();
});