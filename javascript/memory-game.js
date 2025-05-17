const SYMBOLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let hasFlippedCard = false;

let currentLevel = 1;
const maxLevel = 5;

let startTime;
let elapsedBeforePause = 0;
let animationFrameId;
let isTimerPaused = false;

function getNumParisForLevel(level) {
    const levelPairs = {
        1: 5,
        2: 8,
        3: 10,
    };
    return levelPairs[level] || 3;
}

function startLevel(level) {
    const numPairs = getNumParisForLevel(level);
    initGame(numPairs);
    updateLevelDisplay(level);

    document.querySelector('.game-container').style.display = 'block';
    document.getElementById('difficulty-selector').style.display = 'none';
}

function generateDeck(numPairs) {
    const selectedSymbols = SYMBOLS.slice(0, numPairs);
    const deck = [...selectedSymbols, ...selectedSymbols];
    return shuffle(deck);
}

function shuffle(arry) {
    for (let i = arry.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arry[i], arry[j]] = [arry[j], arry[i]];
    }
    return arry;
}

function createCard(symbol) {
    const card = document.createElement('div');
    card.classList.add('memory-card');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.textContent = " ";

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.textContent = symbol;

    card.appendChild(cardFront);
    card.appendChild(cardBack);

    card.dataset.symbol = symbol;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();

    setTimeout(() => {
        checkGameOver();
    }, 600);
}


function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
    hasFlippedCard = false;
}

function initGame(numPairs) {
    const deck = generateDeck(numPairs);
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    deck.forEach(symbol => {
        const card = createCard(symbol);
        gameBoard.appendChild(card);
    });
}

document.getElementById('start-game').addEventListener('click', () => {
    currentLevel = 1;
    elapsedBeforePause = 0;
    startTime = performance.now();
    isTimerPaused = false;

    startLevel(currentLevel);
    updateTimer();
});

function checkGameOver() {
    const cards = document.querySelectorAll('.memory-card');
    const gameOver = Array.from(cards).every(card => card.classList.contains("flip"));

    if (gameOver) {
        if (currentLevel < maxLevel) {
            showLevelOverlay(currentLevel, currentLevel + 1);
            currentLevel++;
        } else {
            showFinalVictoryOverlay();
        }
    }
}

function showFinalVictoryOverlay() {
    cancelAnimationFrame(animationFrameId);
    if (!isTimerPaused) {
        elapsedBeforePause += performance.now() - startTime;
    }

    const totalSeconds = (elapsedBeforePause / 1000).toFixed(1);

    const overlay = document.createElement("div");
    overlay.classList.add('game-over-overlay');
    overlay.innerHTML = `
        <h2>You Win!</h2>
        <p>Congratulations, you completed all levels!</p>
        <p>Total Time: ${totalSeconds}s</p>
        <button id="restart-game" class="btn btn-primary">Restart Game</button>
    `;
    document.body.appendChild(overlay);

    document.getElementById('restart-game').addEventListener('click', () => {
        location.reload();
    });
}

function showLevelOverlay(current, next) {
    // Pause timer
    isTimerPaused = true;
    elapsedBeforePause += performance.now() - startTime;

    const overlay = document.createElement("div");
    overlay.classList.add('game-over-overlay');
    overlay.innerHTML = `
        <h2>Level ${current} Completed!</h2>
        <p>Get ready for Level ${next}!</p>
        <button id="next-level-btn" class="btn btn-primary">Next Level</button>
    `;
    document.body.appendChild(overlay);

    document.getElementById('next-level-btn').addEventListener('click', () => {
        overlay.remove();
        startTime = performance.now();
        isTimerPaused = false;
        startLevel(next);
    });
}

function updateLevelDisplay(level) {
    const levelDisplay = document.getElementById('level-display');
    if (levelDisplay) {
        levelDisplay.textContent = `Level ${level}`;
    }
}

function updateTimer() {
    const timerElement = document.getElementById('timer');

    function tick() {
        if (!isTimerPaused) {
            const now = performance.now();
            const seconds = ((elapsedBeforePause + (now - startTime)) / 1000).toFixed(1);
            timerElement.textContent = `Time: ${seconds}s`;
        }
        animationFrameId = requestAnimationFrame(tick);
    }

    cancelAnimationFrame(animationFrameId);
    tick();
}