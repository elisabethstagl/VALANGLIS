const SYMBOLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let hasFlippedCard = false;

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
    checkGameOver();   // test gameover
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
    gameBoard.innerHTML = '';  //clear old gameworld

    deck.forEach(symbol => {
        const card = createCard(symbol);
        document.getElementById('game-board').appendChild(card);
    });
}

document.getElementById('start-game').addEventListener('click', () => {
    const difficulty = document.getElementById('difficulty').value;
    let numPairs;

    if (difficulty === 'easy') {
        numPairs = 6;
    } else if (difficulty === 'medium') {
        numPairs = 12;
    } else if (difficulty === 'hard') {
        numPairs = 16;
    }

    initGame(numPairs);

    // Show the game area and hide the difficulty selection area
    document.querySelector('.game-container').style.display = 'block';
    document.getElementById('difficulty-selector').style.display = 'none';
});

function checkGameOver() {
const cards = document.querySelectorAll('.memory-card');
const gameOver = Array.from(cards).every(card => card.classList.contains("flip"));
if (gameOver) {
    showGameOverOverlay();
}
}

function showGameOverOverlay() {
const overlay = document.createElement("div");
overlay.classList.add('game-over-overlay');
overlay.innerHTML = `
    <h2>Perfect!</h2>
    <p>Congratulations, you matched all cards.</p>
    <button id="restart-game" class="btn btn-primary">Restart Game</button>
    `;
    document.body.appendChild(overlay);

    document.getElementById('restart-game').addEventListener('click', ()=> {
        location.reload();
    });
}
