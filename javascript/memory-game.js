let firstCard = null;
let secondCard = null;
let lockBoard = false;
let hasFlippedCard = false;

let currentLevel = 1;
const maxLevel = 5;

let levelStartTime;
let animationFrameId;
let isTimerPaused = false;
let shuffleIntervalId = null;

const cardClickCounts = new Map(); // Level 5 tracking

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

function saveProgressToDatabase(level) {
    if (!IS_LOGGED_IN) { // Prüfen, ob der Benutzer angemeldet ist
        console.log("User not logged in, progress will not be saved to database.");
        return;
    }

    $.ajax({
        url: 'save_progress.php',
        type: 'POST',
        data: {
            game_id: MEMORY_GAME_ID, // Aus PHP übergeben
            level_reached: level
        },
        success: function(response) {
            console.log('Progress saved successfully:', response.message);
        },
        error: function(xhr, status, error) {
            console.error('Error saving progress:', xhr.responseText);
        }
    });
}

function generateSymbols(numPairs) {
    const symbolsWithoutSkull = IMAGE_SYMBOLS.filter(sym => sym !== 'skull');
    return symbolsWithoutSkull.slice(0, numPairs);
}

function generateDeck(numPairs, level) {
    let selectedSymbols = generateSymbols(numPairs);
    if (level === 3) {
        selectedSymbols.pop();
        return shuffle([...selectedSymbols, ...selectedSymbols, 'skull', 'skull']);
    }
    return shuffle([...selectedSymbols, ...selectedSymbols]);
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
    card.removeAttribute('data-failed');
    card.classList.add('memory-card');
    card.dataset.symbol = symbol;
    if (symbol === 'skull') card.classList.add('skull-card');

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

    if (currentLevel === 5) {
        const count = cardClickCounts.get(this) || 0;
        if (this.dataset.failed === 'true' || this.classList.contains('matched')) return;

        if (count >= 1) {
            cardClickCounts.set(this, 2);
            this.dataset.failed = 'true';
        } else {
            cardClickCounts.set(this, 1);
        }
    }

    if (hasFlippedCard && secondCard) return;

    this.classList.add('flip');

    if (this.dataset.symbol === 'skull') {
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
    }, 800);
}

function checkForMatch() {
    const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (currentLevel === 5 && !isMatch) {
        const failedFirst = firstCard.dataset.failed === 'true';
        const failedSecond = secondCard.dataset.failed === 'true';

        if (failedFirst || failedSecond) {
            lockBoard = true;
            setTimeout(showLevel5GameOverOverlay, 600);
            return;
        }
    }

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    setTimeout(checkGameOver, 600);
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

function initGame(numPairs, level) {
    const deck = generateDeck(numPairs, level);
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    cardClickCounts.clear();

    deck.forEach(symbol => {
        const card = createCard(symbol);
        gameBoard.appendChild(card);
    });
}

function resetGameState() {
    cancelAnimationFrame(animationFrameId);
    clearInterval(shuffleIntervalId);
    isTimerPaused = false;
    lockBoard = false;
    hasFlippedCard = false;
    [firstCard, secondCard] = [null, null];
    cardClickCounts.clear();
}

function startLevel(level) {
    resetGameState();
    currentLevel = level;

    const numPairs = getNumParisForLevel(level);
    initGame(numPairs, level);
    updateLevelDisplay(level);

    document.querySelector('.game-container').style.display = 'block';
    document.getElementById('start-game-button').style.display = 'none';
    document.getElementById('level-and-timer').style.display = 'block';

    levelStartTime = performance.now();
    updateTimer();

    if (level === 4) {
        shuffleIntervalId = setInterval(shuffleUnflippedCards, 30000);
    }
}

document.getElementById('start-game').addEventListener('click', () => {
    const savedLevel = parseInt(sessionStorage.getItem('memory-last-level')) || 1;
    startLevel(savedLevel);
    renderLevelSelector();
});

function checkGameOver() {
    const cards = document.querySelectorAll('.memory-card');
    const gameOver = Array.from(cards).every(card => card.classList.contains("flip"));
    if (gameOver) {
        if (currentLevel < maxLevel) showLevelOverlay(currentLevel, currentLevel + 1);
        else showFinalVictoryOverlay();
    }
}

function showFinalVictoryOverlay() {
    resetGameState();
    isTimerPaused = true;

    const now = performance.now();
    const levelSeconds = ((now - levelStartTime) / 1000).toFixed(1);

    sessionStorage.setItem('memory-last-level', maxLevel);
    sessionStorage.setItem('memory-max-level', maxLevel);
    saveProgressToDatabase(maxLevel); // Fortschritt in DB speichern

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
        sessionStorage.clear();
        location.reload();
    });
}

function showLevelOverlay(current, next) {
    resetGameState();
    isTimerPaused = true;

    const now = performance.now();
    const levelElapsedTime = now - levelStartTime;
    const levelSeconds = (levelElapsedTime / 1000).toFixed(1);

    sessionStorage.setItem('memory-last-level', next);
    const previousMax = parseInt(sessionStorage.getItem('memory-max-level')) || 1;
    if (next > previousMax) {
        sessionStorage.setItem('memory-max-level', next);
        saveProgressToDatabase(next); // Fortschritt in DB speichern, wenn neues Max-Level
    }

    const overlay = document.createElement("div");
    overlay.classList.add('game-over-overlay');

    let featureText = '';
    if (next === 3) {
        featureText = `
      <br><p>New Feature in Level 3!</p>
      <p>Watch out for <strong>skull cards</strong>!</p>
      <p>Clicking one will flip all revealed cards back!</p><br>`;
    } else if (next === 4) {
        featureText = `
      <br><p>New Feature in Level 4!</p>
      <p>Every <strong>30 seconds</strong>, unflipped cards will shuffle!</p><br>`;
    } else if (next === 5) {
        featureText = `
      <br><p>New Feature in Level 5!</p>
      <p>You may only flip each card <strong>twice</strong>.</p>
      <p>If you fail to match on the second try, <strong>game over</strong>!</p><br>`;
    }

    overlay.innerHTML = `
    <h2>Level ${current} Completed!</h2>
    <p>You completed this level in ${levelSeconds}s</p>
    ${featureText}
    <p>Get ready for Level ${next}!</p>
    <button id="next-level-btn" class="btn-retro">Next Level</button>
  `;
    document.body.appendChild(overlay);

    document.getElementById('next-level-btn').addEventListener('click', () => {
        overlay.remove();
        startLevel(next);
        renderLevelSelector();
    });
}

function showLevel5GameOverOverlay() {
    resetGameState();
    isTimerPaused = true;

    const overlay = document.createElement('div');
    overlay.classList.add('game-over-overlay');
    overlay.innerHTML = `
    <h2>Game Over!</h2>
    <p>You clicked a card twice without matching it.</p>
    <p>Try Level 5 again.</p>
    <button id="retry-level5" class="btn-retro">Retry Level</button>
  `;
    document.body.appendChild(overlay);

    document.getElementById('retry-level5').addEventListener('click', () => {
        overlay.remove();
        startLevel(5);
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

function showShufflePopup() {
    const popup = document.createElement('div');
    popup.classList.add('shuffle-popup');
    popup.textContent = 'Cards Shuffled!';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}

function shuffleUnflippedCards() {
    const board = document.getElementById('game-board');
    const cards = Array.from(board.children);
    const unflipped = cards.filter(card => !card.classList.contains('flip'));

    const symbols = unflipped.map(card => card.dataset.symbol);
    const shuffled = shuffle([...symbols]);

    unflipped.forEach((card, index) => {
        const newSymbol = shuffled[index];
        card.dataset.symbol = newSymbol;
        const backImg = card.querySelector('.card-back img');
        backImg.src = `./images/memory/${newSymbol}.png`;
        backImg.alt = newSymbol;
    });

    showShufflePopup();
}
