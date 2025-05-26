const gameBoardSnake = document.querySelector("#gameBoardSnake");
const ctx = gameBoardSnake.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoardSnake.width;
const gameHeight = gameBoardSnake.height;
const boardBackground = "white";
const snakeColor = "#7f7fff";
const snakeBorder = "black";
const foodColor = "#c83429";
const wallColor = '#727F48';
const unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];


const difficulties = {
    easy: {
        difficulty: 'easy',
        speed: 120,
        speedupfactor: 1,
        walls: [],
    },
    medium: {
        difficulty: 'medium',
        speed: 90,
        speedupfactor: 2,
        walls: [],
    },
    hard: {
        difficulty: 'hard',
        speed: 60,
        speedupfactor: 3,
        walls: [
            {x: 5, y: 5},
            {x: 5, y: 6},
            {x: 5, y: 7},
            {x: 5, y: 8},
            {x: 5, y: 9},
            {x: 14, y: 5},
            {x: 14, y: 6},
            {x: 14, y: 7},
            {x: 14, y: 8},
            {x: 14, y: 9},
            {x: 5, y: 13},
            {x: 6, y: 14},
            {x: 7, y: 14},
            {x: 8, y: 14},
            {x: 9, y: 14},
            {x: 10, y: 14},
            {x: 11, y: 14},
            {x: 12, y: 14},
            {x: 13, y: 14},
            {x: 14, y: 13},
            ],
    }
};


let currentStats = difficulties.easy;



const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('start-game');


window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);


startButton.addEventListener('click', () => {
    let selectedDifficulty = difficultySelect.value;
    switch(selectedDifficulty) {
        case 'easy':
            currentStats = difficulties.easy;
            gameBoardSnake.style.borderColor = 'transparent';
          break;
        case 'medium':
            currentStats = difficulties.medium;
            gameBoardSnake.style.borderColor = 'black';
          break;
        case 'hard':
            currentStats = difficulties.hard;
            gameBoardSnake.style.borderColor = 'black';
          break;
      }
    console.log('Selected difficulty:', selectedDifficulty);

    resetGame();
});



function startGame(){
    running= true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};

function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawWalls();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, currentStats.speed - (score * currentStats.speedupfactor));
    } else{
        displayGameOver();
    }
};

function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }

    // Sicherstellen, dass Food nicht auf einem Schlangenfeld oder Wandfeld ist
    let isOnSnakeOrWall;
    do {
        isOnSnakeOrWall = false;
        foodX = randomFood(0, gameWidth - unitSize);
        foodY = randomFood(0, gameHeight - unitSize);

        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === foodX && snake[i].y === foodY) {
                isOnSnakeOrWall = true;
                break;
            }
        }
        
    for (let i = 0; i < currentStats.walls.length; i++) {
        const wall = currentStats.walls[i];
        const wallX = wall.x * unitSize;
        const wallY = wall.y * unitSize;

        if (wallX === foodX && wallY === foodY) {
            isOnSnakeOrWall = true;
            break;
        }
    }
    } while (isOnSnakeOrWall);
};


function drawWalls(){
    ctx.fillStyle = wallColor;
    currentStats.walls.forEach(wall => {
        ctx.fillRect(wall.x * unitSize, wall.y * unitSize, unitSize, unitSize);
});

};

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake(){

    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};

    // easy difficulty: kann durch Wand / wraps around
    // 
    if(currentStats.difficulty == 'easy'){

        switch(true){
        case (head.x < 0):
            head.x = gameWidth-unitSize;
            break;
        case (head.x >= gameWidth):
            head.x = 0;
            break;
        case (head.y < 0):
            head.y = gameHeight-unitSize;
            break;
        case (head.y >= gameHeight):
            head.y = 0;
            break;
    }
    }

    
    snake.unshift(head);

    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scoreText.textContent = score;
        createFood();
    } else{
        snake.pop();
    }     

};

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};

function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    
    const ALEFT = 65;
    const WUP = 87;
    const DRIGHT = 68;
    const SDOWN = 83;

    // kein Scrollen während dem Spiel:
    if(keyPressed == LEFT || 
        keyPressed == UP ||
        keyPressed == RIGHT ||
        keyPressed == DOWN)
        {
            event.preventDefault();  
        }

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);


    switch(true){
        case((keyPressed == LEFT || keyPressed == ALEFT) && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;

        case((keyPressed == UP || keyPressed == WUP) && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;

        case((keyPressed == RIGHT || keyPressed == DRIGHT) && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;

        case((keyPressed == DOWN || keyPressed == SDOWN) && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }

};

function checkGameOver(){
    // Schlange ist außerhalb Spielfeld
    // für easy-mode gilt wrap around, siehe moveSnake()
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
                running = false;
                break;
    }

    // Schlange berührt sich selbst
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }

    // Schlange berührt Wände
    if (currentStats.walls.some(wall => 
                                wall.x * unitSize == snake[0].x 
                                && wall.y * unitSize == snake[0].y)) {
            running = false;
    }

};

function displayGameOver(){
    ctx.font = '40px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    ctx.fillText("Score: "  + score, gameWidth / 2, gameHeight / 2 + 60);
    running = false;
};

function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];

    startGame();

};