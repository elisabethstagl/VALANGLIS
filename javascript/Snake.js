const canvas = document.getElementById("gameBoardSnake");
const ctx = canvas.getContext("2d");

let unitSize;
const horizontalUnits = 20;
const verticalUnits = 20;

let snake = [];
let xVelocity = 1;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let running = false;

let currentStats;
let mediumUnlocked = false;
let hardUnlocked = false;

const scoreText = document.getElementById("scoreText");
const resetBtn = document.getElementById("resetBtn");
const info = document.getElementById("info");
const startButton = document.getElementById("start-game");
const difficultySelect = document.getElementById("difficulty");
const mediumOption = difficultySelect.querySelector('option[value="medium"]');
const hardOption = difficultySelect.querySelector('option[value="hard"]');

const boardBackground = "white";
const snakeColor = "#7f7fff";
const snakeBorder = "black";
const foodColor = "#c83429";
const wallColor = '#727F48';

const difficulties = {
    easy: {
        difficulty: 'easy',
        speed: 120,
        speedupfactor: 1,
        walls: []
    },
    medium: {
        difficulty: 'medium',
        speed: 90,
        speedupfactor: 2,
        walls: []
    },
    hard: {
        difficulty: 'hard',
        speed: 60,
        speedupfactor: 3,
        walls: [
            { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 },
            { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 },
            { x: 5, y: 13 }, { x: 6, y: 14 }, { x: 7, y: 14 }, { x: 8, y: 14 },
            { x: 9, y: 14 }, { x: 10, y: 14 }, { x: 11, y: 14 }, { x: 12, y: 14 }, { x: 13, y: 14 },
            { x: 14, y: 13 },
        ]
    }
};

function resizeCanvas() {
    const maxVisibleSize = Math.min(window.innerWidth - 40, 500);
    canvas.style.width = `${maxVisibleSize}px`;
    canvas.style.height = `${maxVisibleSize}px`;

    unitSize = Math.floor(maxVisibleSize / horizontalUnits);

    canvas.width = unitSize * horizontalUnits;
    canvas.height = unitSize * verticalUnits;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * unitSize, y * unitSize, unitSize, unitSize);
    ctx.strokeStyle = snakeBorder;
    ctx.strokeRect(x * unitSize, y * unitSize, unitSize, unitSize);
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(part => drawRect(part.x, part.y, snakeColor));
}

function drawWalls() {
    currentStats.walls.forEach(wall => drawRect(wall.x, wall.y, wallColor));
}

function drawFood() {
    drawRect(foodX, foodY, foodColor);
}

function createFood() {
    do {
        foodX = Math.floor(Math.random() * horizontalUnits);
        foodY = Math.floor(Math.random() * verticalUnits);
    } while (
        snake.some(s => s.x === foodX && s.y === foodY) ||
        currentStats.walls.some(w => w.x === foodX && w.y === foodY)
    );
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };

    if (currentStats.difficulty === "easy") {
        if (head.x < 0) head.x = horizontalUnits - 1;
        if (head.x >= horizontalUnits) head.x = 0;
        if (head.y < 0) head.y = verticalUnits - 1;
        if (head.y >= verticalUnits) head.y = 0;
    }

    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score++;
        scoreText.textContent = "Score: " + score;
        createFood();
    } else {
        snake.pop();
    }
}

function checkGameOver() {
    const [head] = snake;

    if (currentStats.difficulty !== 'easy') {
        if (head.x < 0 || head.x >= horizontalUnits || head.y < 0 || head.y >= verticalUnits) {
            running = false;
        }
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) running = false;
    }

    if (currentStats.walls.some(w => w.x === head.x && w.y === head.y)) {
        running = false;
    }
}

function displayGameOver() {
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 40);
}

function unlockAnimation() {
    difficultySelect.classList.add('level-unlocked');
    setTimeout(() => difficultySelect.classList.remove('level-unlocked'), 3000);
}

function checkLevelUnlock() {
    if (!mediumUnlocked && currentStats.difficulty === 'easy' && score === 3) {
        mediumUnlocked = true;
        mediumOption.disabled = false;
        mediumOption.textContent = 'medium';
        mediumOption.selected = true;
        sessionStorage.setItem('snake-max-level', '2');
        saveProgressToDatabase(SNAKE_GAME_ID, 2);
        unlockAnimation();
    }
    if (!hardUnlocked && currentStats.difficulty === 'medium' && score === 5) {
        hardUnlocked = true;
        hardOption.disabled = false;
        hardOption.textContent = 'hard';
        hardOption.selected = true;
        sessionStorage.setItem('snake-max-level', '3');
        saveProgressToDatabase(SNAKE_GAME_ID, 3);
        unlockAnimation();
    }
}

function nextTick() {
    if (!running) return displayGameOver();

    setTimeout(() => {
        clearBoard();
        drawWalls();
        drawFood();
        moveSnake();
        drawSnake();
        checkLevelUnlock();
        checkGameOver();
        nextTick();
    }, currentStats.speed - (score * currentStats.speedupfactor));
}

function startGame() {
    running = true;
    scoreText.textContent = "Score: " + score;
    createFood();
    drawFood();
    nextTick();
}

function resetGame() {
    score = 0;
    xVelocity = 1;
    yVelocity = 0;
    snake = [
        { x: 4, y: 0 },
        { x: 3, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 }
    ];
    startGame();
}

function changeDirection(event) {
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    const A = 65, W = 87, D = 68, S = 83;
    const key = event.keyCode;

    const goingUp = yVelocity === -1;
    const goingDown = yVelocity === 1;
    const goingRight = xVelocity === 1;
    const goingLeft = xVelocity === -1;

    if ([LEFT, UP, RIGHT, DOWN].includes(key)) event.preventDefault();

    if ((key === LEFT || key === A) && !goingRight) {
        xVelocity = -1; yVelocity = 0;
    } else if ((key === RIGHT || key === D) && !goingLeft) {
        xVelocity = 1; yVelocity = 0;
    } else if ((key === UP || key === W) && !goingDown) {
        xVelocity = 0; yVelocity = -1;
    } else if ((key === DOWN || key === S) && !goingUp) {
        xVelocity = 0; yVelocity = 1;
    }
}

function loadLevelUnlockState() {
    const level = parseInt(sessionStorage.getItem('snake-max-level'), 10) || 1;
    if (level >= 2) {
        mediumUnlocked = true;
        mediumOption.disabled = false;
        mediumOption.textContent = 'medium';
    }
    if (level >= 3) {
        hardUnlocked = true;
        hardOption.disabled = false;
        hardOption.textContent = 'hard';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    resizeCanvas();
    loadLevelUnlockState();
});

startButton.addEventListener("click", () => {
    const selected = difficultySelect.value;
    currentStats = difficulties[selected];
    canvas.style.borderColor = selected === "easy" ? "transparent" : "black";
    info.classList.remove('hidden');

    if (selected === 'easy') info.textContent = "Teleportiere dich durch die Wände!";
    if (selected === 'medium') info.textContent = "Die Wände sind fest – halte Abstand!";
    if (selected === 'hard') info.textContent = "ALLE Wände sind fest – halte Abstand!";

    resetGame();
});

resetBtn.addEventListener("click", resetGame);
window.addEventListener("keydown", changeDirection);
