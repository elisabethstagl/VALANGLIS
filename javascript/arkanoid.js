const canvas = document.getElementById("arkanoidCanvas");
const ctx = canvas.getContext("2d");

// Neue Variable für den Spielstart
let isGameStarted = false;

// Neue Variable für das Level
let currentLevel = 1;

// Beim Laden prüfen, ob ein Level gespeichert ist
const savedLevel = sessionStorage.getItem("arkanoidLevel");
if (savedLevel) {
  currentLevel = parseInt(savedLevel, 10);
}

// Ball properties
let ballRadius = 20;
let x = canvas.width / 2;
let y = canvas.height - 30 - ballRadius; // Ball auf dem Paddle positionieren
let dx = 0; // Keine horizontale Bewegung
let dy = -2; // Vertikale Bewegung nach oben
let ballColor = "#0095DD"; // Standardfarbe des Balls
let ballImage = null; // Balltextur (Bild)

function selectBall(color) {
  ballColor = color;
  ballImage = null;
  paddleColor = (color === "#FF0000") ? "#FF0000" : "#0095DD";

  // Zeige die Level-Auswahl nach Ballwahl
  const levelSelect = document.getElementById("arkanoid-level-selection");
  if (levelSelect) {
    levelSelect.style.display = "block";
  }

  startGame();
}

function registerBallSelectHandlers() {
  document
    .getElementById("arkanoid-ball-blue")
    .addEventListener("click", () => selectBall("#0095DD"));

  document
    .getElementById("arkanoid-ball-red")
    .addEventListener("click", () => selectBall("#FF0000"));
}

if (document.readyState === "loading") {
  // Seite ist noch nicht komplett geparst
  document.addEventListener("DOMContentLoaded", registerBallSelectHandlers);
} else {
  // DOM ist schon fertig → sofort registrieren
  registerBallSelectHandlers();
}

function startGame() {
  // Ballgeschwindigkeit und Position neu setzen
  dx = 0;
  dy = -2;
  x = canvas.width / 2;
  y = canvas.height - 30 - ballRadius;

  document.getElementById("ball-selection").style.display = "none";
  document.getElementById("arkanoidCanvas").style.display = "block";

  draw();
}

// Lädt ein Level frisch, egal wann der Button geklickt wurde
function switchLevel(level) {
  const btn = document.getElementById(`arkanoid-btn-lv${level}`);
  if (!btn || btn.classList.contains("locked")) return;

  currentLevel = level;
  isGameStarted = false;
  isGameOver = false;
  dx = 0;
  dy = -2;

  if (level === 1) {
    resetGame(); // baut Level-1-Bricks auf
    document.getElementById("ball-selection").style.display = "none";
    document.getElementById("arkanoidCanvas").style.display = "block";
  } else if (level === 2) {
    startLevel2();
  } else if (level === 3) {
    startLevel3();
  }

  persistLevel(level);
  draw(); // direkt rendern
}

// Paddle properties
const paddleHeight = 20;
const paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleColor = "#0095DD"; // Standard: blaues Paddle

// Controls
let rightPressed = false;
let leftPressed = false;

// Brick properties
let brickRowCount = 5;
let brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
    bricks[c][r] = { x: brickX, y: brickY, status: 1 };
  }
}

let remainingBricks = brickRowCount * brickColumnCount; // Gesamtanzahl der Bricks

// Event listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

// Event listener für Mausklick
canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0 && !isGameStarted) {
    // Linke Maustaste und Spiel nicht gestartet
    isGameStarted = true; // Spiel starten
  }
});

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function touchMoveHandler(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const relativeX = touch.clientX - rect.left;

  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
  // Scrollen verhindern
  e.preventDefault();
}

canvas.addEventListener(
  "touchstart",
  (e) => {
    if (!isGameStarted) {
      isGameStarted = true;
      e.preventDefault();        
    }
  },
  { passive: false }          
);



canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });


function keyDownHandler(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "d" ||
    e.key === "D"
  ) {
    rightPressed = true;
  } else if (
    e.key === "Left" ||
    e.key === "ArrowLeft" ||
    e.key === "a" ||
    e.key === "A"
  ) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "d" ||
    e.key === "D"
  ) {
    rightPressed = false;
  } else if (
    e.key === "Left" ||
    e.key === "ArrowLeft" ||
    e.key === "a" ||
    e.key === "A"
  ) {
    leftPressed = false;
  }
}

// Funktion, um das nächste Level zu starten
function nextLevel() {
  if (currentLevel === 1) {
    const nextlevelbtn = document.getElementById("arkanoid-btn-lv2");
    nextlevelbtn.classList.remove("locked");

    persistLevel(2);

    setTimeout(() => {
      currentLevel++;
      startLevel2();
    }, 2000);

  } else if (currentLevel === 2) {
    const nextlevelbtn = document.getElementById("arkanoid-btn-lv3");
    nextlevelbtn.classList.remove("locked");

    persistLevel(3);


    setTimeout(() => {
      currentLevel++;
      startLevel3();
    }, 2000);

  } else if (currentLevel === 3) {
    setTimeout(() => {
      showVictoryOverlay();
    }, 1000);
  }
}


function startLevel2() {
  // Initialisiere Level 2
  brickRowCount = 4;
  brickColumnCount = 9;
  remainingBricks = brickRowCount * brickColumnCount;

  // Bricks neu initialisieren
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      bricks[c][r] = { x: brickX, y: brickY, status: 1 };
    }
  }

  // Ball und Paddle zurücksetzen
  x = canvas.width / 2;
  y = canvas.height - 30 - ballRadius;
  dx = 0; // Keine horizontale Bewegung
  dy = -2 * 1.3; // Vertikale Bewegung um 30% schneller
  paddleX = (canvas.width - paddleWidth) / 2;

  // Spielstatus zurücksetzen
  isGameStarted = false;

  // Starte das nächste Level
  draw();
}

// Funktion zum Initialisieren der Bricks für Level 3
function initLevel3Bricks() {
  brickRowCount = 1;
  brickColumnCount = 3;
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, hits: 2 }; // 2 Treffer nötig
    }
  }
}

function startLevel3() {
  brickRowCount = 4;
  brickColumnCount = 9;
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      bricks[c][r] = { x: brickX, y: brickY, status: 1, hits: 2 }; // 2 Treffer nötig
    }
  }
  // Korrigiere die Zählung: Nur Bricks mit status 1 und hits > 0 zählen
  remainingBricks = brickRowCount * brickColumnCount;
  // Ball und Paddle zurücksetzen
  x = canvas.width / 2;
  y = canvas.height - 30 - ballRadius;
  dx = 0; // Ball ruht auf Paddle (wichtig!)
  dy = -2 * 0.5; // Geschwindigkeit für Level 3 anpassen (Punkt statt Komma)
  paddleX = (canvas.width - paddleWidth) / 2;
  isGameStarted = false; // Ball startet erst nach Klick!
  draw();
}

// Collision detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        // Prüfe, ob der Ball den Brick berührt
        if (
          x + ballRadius > b.x &&
          x - ballRadius < b.x + brickWidth &&
          y + ballRadius > b.y &&
          y - ballRadius < b.y + brickHeight
        ) {
          // Prüfe, ob die Kollision von oben/unten oder von der Seite kommt
          const ballHitsTopOrBottom = x > b.x && x < b.x + brickWidth;
          const ballHitsLeftOrRight = y > b.y && y < b.y + brickHeight;

          if (ballHitsTopOrBottom) {
            dy = -dy;
          } else if (ballHitsLeftOrRight) {
            dx = -dx;
          }

          // Anpassung für Level 3: Brick braucht 2 Treffer
          if (currentLevel === 3 && typeof b.hits === "number") {
            b.hits--;
            if (b.hits <= 0) {
              b.status = 0;
              remainingBricks--;
            }
          } else {
            b.status = 0;
            remainingBricks--;
          }

          // Prüfe, ob alle Bricks zerstört wurden
          if (remainingBricks === 0) {
            // Ball anhalten
            dx = 0;
            dy = 0;
            setTimeout(() => {
              nextLevel(); // Starte das nächste Level
              console.log("Alle Bricks zerstört, nächstes Level!");
            }, 100);
          }

          // Beende die Schleife, sobald ein Treffer erkannt wurde
          return;
        }
      }
    }
  }
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  if (ballImage) {
    // Zeichne das Bild, wenn es ausgewählt wurde
    ctx.drawImage(
      ballImage,
      x - ballRadius,
      y - ballRadius,
      ballRadius * 2,
      ballRadius * 2
    );
  } else {
    // Zeichne den Ball mit der Farbe
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
  }
  ctx.closePath();
}

// Draw paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

// Draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        ctx.beginPath();
        ctx.rect(b.x, b.y, brickWidth, brickHeight);
        // Level 3: Orange/Blau je nach Treffer, Level 2: Gelb, sonst Blau
        if (currentLevel === 3 && typeof b.hits === "number") {
          ctx.fillStyle = b.hits === 2 ? "#FFA500" : "#0095DD";
        } else if (currentLevel === 2) {
          ctx.fillStyle = "#FFD700"; // Gelb für Level 2
        } else {
          ctx.fillStyle = "#0095DD";
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Paddle movement logic
function movePaddle() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

// Reset game function
function resetGame() {
  isGameStarted = false;
  isGameOver = false;

  // Bricks und Spielzustand je nach aktuellem Level initialisieren
  if (currentLevel === 1) {
    brickRowCount = 5;
    brickColumnCount = 9;
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r] = { x: brickX, y: brickY, status: 1 };
      }
    }
    remainingBricks = brickRowCount * brickColumnCount;
  } else if (currentLevel === 2) {
    startLevel2();
    return; // Level 2 wird komplett von startLevel2() gesetzt
  } else if (currentLevel === 3) {
    startLevel3();
    return; // Level 3 wird komplett von startLevel3() gesetzt
  }

  // Ball und Paddle zurücksetzen
  x = canvas.width / 2;
  y = canvas.height - 30 - ballRadius;
  dx = 0;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;

  const stored = parseInt(sessionStorage.getItem("arkanoidLevel"), 10) || 1;
  if (currentLevel > stored) {
    sessionStorage.setItem("arkanoidLevel", String(currentLevel));
  }


  // Oberfläche zurücksetzen
  document.getElementById("ball-selection").style.display = "block";
  document.getElementById("arkanoidCanvas").style.display = "none";
}


let isGameOver = false; // NEU: Game Over Status

function showGameOverOverlay() {
  // Overlay nur einmal anzeigen
  if (document.getElementById("arkanoid-gameover-overlay")) return;
  const overlay = document.createElement("div");
  overlay.id = "arkanoid-gameover-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.7)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";
  overlay.innerHTML = `
    <div style="background:rgba(255, 255, 255, 0.74);padding:40px 60px;border-radius:20px;box-shadow:0 0 20px #000;text-align:center;">
      <h2>Game Over!</h2>
      <button id="arkanoid-restart-btn" class="btn btn-primary mt-3">Neustarten</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById("arkanoid-restart-btn").onclick = function () {
    overlay.remove();
    resetGame();
    isGameOver = false;
    draw();
  };
}

document.getElementById("arkanoid-btn-lv1").onclick = () => switchLevel(1);
document.getElementById("arkanoid-btn-lv2").onclick = () => switchLevel(2);
document.getElementById("arkanoid-btn-lv3").onclick = () => switchLevel(3);

function showVictoryOverlay() {
  // Overlay nur einmal anzeigen
  if (document.getElementById("arkanoid-victory-overlay")) return;
  const overlay = document.createElement("div");
  overlay.id = "arkanoid-victory-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.7)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";
  overlay.innerHTML = `
    <div style="background:rgba(255, 255, 255, 0.95);padding:40px 60px;border-radius:20px;box-shadow:0 0 20px #000;text-align:center;">
      <h2>Herzlichen Glückwunsch!</h2>
      <p>Du hast alle Level abgeschlossen!</p>
      <button id="arkanoid-victory-restart-btn" class="btn btn-primary mt-3">Neustarten</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById("arkanoid-victory-restart-btn").onclick =
    function () {
      overlay.remove();
      resetGame();
      isGameOver = false;
      draw();
    };
}

// Draw everything
function draw() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();

  if (isGameStarted) {
    // Unterteile die Bewegung in kleinere Schritte
    const steps = 5; // Anzahl der Schritte pro Frame
    const stepX = dx / steps;
    const stepY = dy / steps;

    for (let i = 0; i < steps; i++) {
      x += stepX;
      y += stepY;

      // Prüfe nach jedem Schritt auf Kollision mit Bricks
      collisionDetection();

      // Prüfe auf Kollision mit den Wänden
      if (x + ballRadius > canvas.width || x - ballRadius < 0) {
        dx = -dx; // Horizontale Richtung umkehren
        x =
          x + ballRadius > canvas.width
            ? canvas.width - ballRadius
            : ballRadius; // Position korrigieren
        break;
      }
      if (y - ballRadius <= 0) {
        dy = -dy; // Vertikale Richtung umkehren
        y = ballRadius; // Position korrigieren
        break;
      }

      // Prüfe auf Kollision mit dem Paddle (inkl. Ballradius!)
      if (y + ballRadius > canvas.height - paddleHeight) {
        const hitPaddle =
          x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth;

        if (hitPaddle) {
          const paddleCenter = paddleX + paddleWidth / 2;
          const hitPosition = (x - paddleCenter) / (paddleWidth / 2);
          dx = hitPosition * 4;
          dy = -dy;
          break;
        } else {
          // Ball hat Paddle verfehlt
          isGameStarted = false;
          isGameOver = true;
          showGameOverOverlay();
          return;
        }
      }


      // Ball fällt ganz nach unten (Failsafe, falls Paddle nicht getroffen)
      if (y - ballRadius > canvas.height) {
        isGameStarted = false;
        isGameOver = true;
        showGameOverOverlay();
        return;
      }
    }
  } else {
    // Ball bleibt auf dem Paddle
    x = paddleX + paddleWidth / 2;
    y = canvas.height - paddleHeight - ballRadius;
  }

  // Paddle movement
  movePaddle();

  requestAnimationFrame(draw);
}

draw();
// Paddle movement
movePaddle();

requestAnimationFrame(draw);

function persistLevel(level) {
  // 1) immer die höhere Zahl speichern
  const stored = parseInt(sessionStorage.getItem("arkanoidLevel"), 10) || 1;
  if (level > stored) {
    sessionStorage.setItem("arkanoidLevel", String(level));
    if (typeof saveProgressToDatabase === "function") {
      saveProgressToDatabase(ARKANOID_GAME_ID, level);
    }
  }
}

function syncArkanoidProgress() {
  const level = parseInt(sessionStorage.getItem("arkanoidLevel"), 10) || 1;

  // Buttons erst freischalten, DANN Events binden
  if (level >= 2) {
    document.getElementById("arkanoid-btn-lv2").classList.remove("locked");
  }
  if (level >= 3) {
    document.getElementById("arkanoid-btn-lv3").classList.remove("locked");
  }

  // Progress auch an die DB pushen, falls eingeloggt
  if (typeof saveProgressToDatabase === "function") {
    saveProgressToDatabase(ARKANOID_GAME_ID, level);
  }
}

// DOM fertig?  →  Progress synchronisieren
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", syncArkanoidProgress);
} else {
  syncArkanoidProgress();
}
