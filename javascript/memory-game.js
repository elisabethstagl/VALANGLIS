let firstCard = null;
let secondCard = null;
let lockBoard = false;
let hasFlippedCard = false;

let currentLevel = 1;
const maxLevel = 5;

let levelStartTime;
let animationFrameId;
let isTimerPaused = false;

const IMAGE_SYMBOLS = [
    'among-us', 'beer', 'cake', 'camera', 'car', 'castle', 'cat-4', 'chicken',
    'coke', 'disc', 'earth', 'grapes', 'heart', 'light-bulb', 'pizza',
    'soup', 'yoda', 'yoshi', 'sushi', 'strawberry-cake', 'skull'
];

function getNumParisForLevel(level) {
    const levelPairs = {
        1: 8,
        2: 12,
        3: 12,
        4: 16,
        5: 20
    };
    return levelPairs[level] || 5;
}

function generateSymbols(numPairs) {
    const symbolsWithoutSkull = IMAGE_SYMBOLS.filter(sym => sym !== 'skull');
    return symbolsWithoutSkull.slice(0, numPairs);
}

function generateDeck(numPairs, level) {
    let selectedSymbols = generateSymbols(numPairs);

    // For Level 3: Replace 1 pair with 2 skulls to keep layout (24 cards)
    if (level === 3) {
        selectedSymbols.pop(); // Remove last symbol (1 pair = 2 cards)
        const deck = [...selectedSymbols, ...selectedSymbols, 'skull', 'skull'];
        console.log(`Deck for Level ${level}:`, deck);
        return shuffle(deck);
    }

    const deck = [...selectedSymbols, ...selectedSymbols];
    return shuffle(deck);
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function createCard(symbol) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.symbol = symbol;

    if (symbol === 'skull') {
        card.classList.add('skull-card');
    }

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    const frontImg = document.createElement('img');
    frontImg.src = './images/memory/card-bg.png';
    frontImg.alt = 'Card Back';
    frontImg.classList.add('card-img');
    cardFront.appendChild(frontImg);

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    const backImg = document.createElement('img');
    backImg.src = `./images/memory/${symbol}.png`;
    backImg.alt = symbol;
    backImg.classList.add('card-img');
    cardBack.appendChild(backImg);

    card.appendChild(cardFront);
    card.appendChild(cardBack);
    card.addEventListener('click', flipCard);

    return card;
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('flip')) return;

    const symbol = this.dataset.symbol;
    this.classList.add('flip');

    if (symbol === 'skull') {
        setTimeout(() => handleSkullCard(this), 300);
        return;
    }

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}


function handleSkullCard(card) {
    if (lockBoard) return;
    lockBoard = true;

    setTimeout(() => {
        const flippedCards = document.querySelectorAll('.memory-card.flip');

        flippedCards.forEach(c => {
            if (c !== card) {
                c.classList.remove('flip');
                c.addEventListener('click', flipCard, { once: false });
            }
        });

        card.remove();

        resetBoard();

    }, 800); // Let flip animation play
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

        // Re-enable clicking
        firstCard.addEventListener('click', flipCard, { once: false });
        secondCard.addEventListener('click', flipCard, { once: false });

        resetBoard();
    }, 1000);
}


function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
    hasFlippedCard = false;
}

function initGame(numPairs, level) {
    const deck = generateDeck(numPairs, level);
    const totalCards = deck.length;
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    deck.forEach(symbol => {
        const card = createCard(symbol);
        gameBoard.appendChild(card);
    });
}

function startLevel(level) {
    currentLevel = level;

    const numPairs = getNumParisForLevel(level);
    initGame(numPairs, level);
    updateLevelDisplay(level);

    document.querySelector('.game-container').style.display = 'block';
    document.getElementById('start-game-button').style.display = 'none';
    document.getElementById('level-and-timer').style.display = 'block';

    levelStartTime = performance.now();
    isTimerPaused = false;
    updateTimer();
}

document.getElementById('start-game').addEventListener('click', () => {
    const savedLevel = parseInt(sessionStorage.getItem('memory-last-level')) || 1;
    currentLevel = savedLevel;

    startLevel(currentLevel);
    renderLevelSelector();
});

function checkGameOver() {
    const cards = document.querySelectorAll('.memory-card');
    const gameOver = Array.from(cards).every(card => card.classList.contains("flip"));

    if (gameOver) {
        if (currentLevel < maxLevel) {
            showLevelOverlay(currentLevel, currentLevel + 1);
        } else {
            showFinalVictoryOverlay();
        }
    }
}

function showFinalVictoryOverlay() {
    cancelAnimationFrame(animationFrameId);
    isTimerPaused = true;

    const now = performance.now();
    const levelSeconds = ((now - levelStartTime) / 1000).toFixed(1);

    sessionStorage.setItem('memory-last-level', maxLevel);
    sessionStorage.setItem('memory-max-level', maxLevel);

    const overlay = document.createElement("div");
    overlay.classList.add('game-over-overlay');
    overlay.innerHTML = `
        <h2>You Win!</h2>
        <p>Congratulations, you completed all levels!</p>
        <p>Last Level Time: ${levelSeconds}s</p>
        <div class="button-group">
            <button id="home-btn" class="btn-retro">Back to Home</button>
            <button id="restart-game" class="btn-retro">Restart Game</button>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('home-btn').addEventListener('click', () => {
        window.location.href = 'index.php';
    });

    document.getElementById('restart-game').addEventListener('click', () => {
        sessionStorage.removeItem('memory-last-level');
        sessionStorage.removeItem('memory-max-level');
        location.reload();
    });
}

function showLevelOverlay(current, next) {
    isTimerPaused = true;

    const now = performance.now();
    const levelElapsedTime = now - levelStartTime;
    const levelSeconds = (levelElapsedTime / 1000).toFixed(1);

    sessionStorage.setItem('memory-last-level', next);

    const previousMax = parseInt(sessionStorage.getItem('memory-max-level')) || 1;
    if (next > previousMax) {
        sessionStorage.setItem('memory-max-level', next);
    }

    const overlay = document.createElement("div");
    overlay.classList.add('game-over-overlay');

    const skullWarning = next === 3
        ? `
            <br>
            <p>New Feature in Level 3!</p>
            <p>Watch out for <strong>skull cards</strong>!</p>
            <p>Clicking one will flip all revealed cards back!</p>
            <br>
            `
        : '';

    overlay.innerHTML = `
        <h2>Level ${current} Completed!</h2>
        <p>You completed this level in ${levelSeconds}s</p>
        ${skullWarning}
        <p>Get ready for Level ${next}!</p>
        <button id="next-level-btn" class="btn-retro">Next Level</button>
    `;

    document.body.appendChild(overlay);

    document.getElementById('next-level-btn').addEventListener('click', () => {
        overlay.remove();
        levelStartTime = performance.now();
        isTimerPaused = false;
        currentLevel = next;
        startLevel(next);
        renderLevelSelector();
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
            const seconds = ((now - levelStartTime) / 1000).toFixed(1);
            timerElement.textContent = `Time: ${seconds}s`;
        }
        animationFrameId = requestAnimationFrame(tick);
    }

    cancelAnimationFrame(animationFrameId);
    tick();
}


function renderLevelSelector() {
    const container = document.getElementById('level-selector');
    if (!container) return;

    const maxUnlocked = parseInt(sessionStorage.getItem('memory-max-level')) || 1;
    container.innerHTML = '';

    for (let i = 1; i <= maxLevel; i++) {
        const btn = document.createElement('button');
        btn.textContent = `Lvl ${i}`;
        btn.classList.add('level-button');
        if (i <= maxUnlocked) {
            btn.disabled = false;
            btn.addEventListener('click', () => {
                currentLevel = i;
                startLevel(i);
                renderLevelSelector();
            });
        } else {
            btn.disabled = true;
            btn.classList.add('locked');
        }
        container.appendChild(btn);
    }
}