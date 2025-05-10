const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// Images
const playerImg = new Image();
playerImg.src = './images/platformer-game/pixel-pete.png';

const flagImg = new Image();
flagImg.src = './images/platformer-game/flag.png';

const fruitImages = [
    { src: './images/platformer-game/melon.png', points: 10 },
    { src: './images/platformer-game/banana.png', points: 20 },
    { src: './images/platformer-game/cherry.png', points: 30 },
    { src: './images/platformer-game/lemon.png', points: 30 }
];

fruitImages.forEach(fruit => {
    const img = new Image();
    img.src = fruit.src;
    fruit.image = img;
});

// Game state
let level = 1;
let gameStarted = false;
let gravity = 0.5;
let keys = {};
let score = 0;

let player = {
    x: 50,
    y: 0,
    width: 70,
    height: 120,
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
let fruits = [];
let goal = {};
let levelEndX = 0;

function createLevel() {
    blocks = [];

    const screenWidth = canvas.width;
    const levelLength = screenWidth + (level - 1) * 400;

    goal = {
        x: levelLength - 60,
        y: 400,
        width: 40,
        height: 80
    };

    levelEndX = levelLength;

    // Ground
    const blockSize = 50;
    const blockCount = Math.ceil(levelEndX / blockSize);
    for (let i = 0; i < blockCount; i++) {
        blocks.push({ x: i * blockSize, y: 450, width: blockSize, height: 50 });
    }

    // Platforms
    if (level === 1) {
        blocks.push({ x: 300, y: 370, width: 100, height: 20 });
        blocks.push({ x: 600, y: 300, width: 100, height: 20 });
    } else {
        for (let i = 0; i < level + 2; i++) {
            blocks.push({
                x: 400 + i * 300,
                y: 300 - (i % 3) * 50,
                width: 100,
                height: 20
            });
        }
    }

    // Reset player
    player.x = 50;
    player.y = 0;
    player.velocityY = 0;
    player.jumpCount = 0;
    worldOffset = 0;

    // Fruits
    fruits.length = 0;
    const fruitCount = 5;
    const fruitWidth = 30;
    const fruitHeight = 30;

    let candidates = [...blocks];
    candidates.push({ x: 0, y: 450, width: levelEndX, height: 50 }); // ground

    while (fruits.length < fruitCount && candidates.length > 0) {
        const platform = candidates[Math.floor(Math.random() * candidates.length)];
        const xMin = platform.x;
        let xMax = Math.min(platform.x + platform.width - fruitWidth, goal.x - fruitWidth);

        if (xMax <= xMin) continue;

        const x = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
        const y = platform.y - fruitHeight;

        const overlaps = fruits.some(f =>
            x < f.x + f.width &&
            x + fruitWidth > f.x &&
            y < f.y + f.height &&
            y + fruitHeight > f.y
        );

        if (!overlaps) {
            const fruitType = fruitImages[Math.floor(Math.random() * fruitImages.length)];
            fruits.push({
                ...fruitType,
                x,
                y,
                width: fruitWidth,
                height: fruitHeight
            });
        }
    }
}

function drawPlayer() {
    ctx.drawImage(playerImg, player.x - worldOffset, player.y, player.width, player.height);
}

function drawBlocks() {
    ctx.fillStyle = '#6a040f';
    blocks.forEach(b => ctx.fillRect(b.x - worldOffset, b.y, b.width, b.height));

    // Fruits
    fruits.forEach(fruit => {
        ctx.drawImage(fruit.image, fruit.x - worldOffset, fruit.y, fruit.width, fruit.height);
    });

    // Flag image
    ctx.drawImage(flagImg, goal.x - worldOffset, goal.y - goal.height + 20, goal.width, goal.height);
}

function updatePlayer() {
    player.velocityY += gravity;
    player.y += player.velocityY;
    player.velocityX = 0;

    if ((keys['ArrowLeft'] || keys['a']) && player.x > 0)
        player.velocityX = -player.speed;

    if ((keys['ArrowRight'] || keys['d']) && player.x + player.width < goal.x + goal.width)
        player.velocityX = player.speed;

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

    if ((keys[' '] || keys['w'] || keys['ArrowUp']) && !keys['_jumpPressed'] && player.jumpCount < player.maxJumps) {
        player.velocityY = player.jumpStrength;
        player.jumpCount++;
        keys['_jumpPressed'] = true;
    }

    if (!keys[' '] && !keys['w'] && !keys['ArrowUp']) {
        keys['_jumpPressed'] = false;
    }

    // Fruit collection
    for (let i = fruits.length - 1; i >= 0; i--) {
        const fruit = fruits[i];
        if (
            player.x + player.width > fruit.x &&
            player.x < fruit.x + fruit.width &&
            player.y + player.height > fruit.y &&
            player.y < fruit.y + fruit.height
        ) {
            score += fruit.points;
            fruits.splice(i, 1);
        }
    }

    // Goal reached
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

    document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
    document.getElementById('levelDisplay').textContent = `Level: ${level}`;

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
