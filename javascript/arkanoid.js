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
  ballColor = color; // Setze die ausgewählte Farbe
  ballImage = null; // Entferne die Bildtextur
  startGame();
}

function selectBallImage(imageSrc) {
  ballImage = new Image();
  ballImage.src = `./images/${imageSrc}`; // Lade das Bild
  ballColor = null; // Entferne die Farbe
  startGame();
}

function startGame() {
  document.getElementById("ball-selection").style.display = "none"; // Verstecke die Ballauswahl
  document.getElementById("arkanoidCanvas").style.display = "block"; // Zeige das Spielfeld

  // Zeige die Status-Bar für das aktuelle Level
  if (currentLevel === 1) {
    document.getElementById("level-status-1").style.display = "flex";
  } else if (currentLevel === 2) {
    document.getElementById("level-status-2").style.display = "flex";
  }

  draw(); // Starte das Spiel
}

// Paddle properties
const paddleHeight = 20;
const paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;

// Controls
let rightPressed = false;
let leftPressed = false;

// Brick properties
let brickRowCount = 5;
let brickColumnCount = 1;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
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
    // Level 1 abgeschlossen
    const levelStatusText1 = document.getElementById("level-status-text-1");
    const checkSymbol1 = document.getElementById("check-symbol-1");
    levelStatusText1.textContent = "Level 1 - Abgeschlossen";
    checkSymbol1.style.display = "inline";

    setTimeout(() => {
      currentLevel++;
      const levelStatus2 = document.getElementById("level-status-2");
      const levelStatusText2 = document.getElementById("level-status-text-2");
      levelStatus2.style.display = "flex";
      levelStatusText2.textContent = "Level 2 - Läuft";
      startLevel2();
    }, 2000);
  } else if (currentLevel === 2) {
    // Level 2 abgeschlossen
    const levelStatusText2 = document.getElementById("level-status-text-2");
    const checkSymbol2 = document.getElementById("check-symbol-2");
    levelStatusText2.textContent = "Level 2 - Abgeschlossen";
    checkSymbol2.style.display = "inline";

    setTimeout(() => {
      currentLevel++;
      const levelStatus3 = document.getElementById("level-status-3");
      const levelStatusText3 = document.getElementById("level-status-text-3");
      levelStatus3.style.display = "flex";
      levelStatusText3.textContent = "Level 3 - Läuft";
      startLevel3();
    }, 2000);
  } else if (currentLevel === 3) {
    // Level 3 abgeschlossen
    const levelStatusText3 = document.getElementById("level-status-text-3");
    const checkSymbol3 = document.getElementById("check-symbol-3");
    levelStatusText3.textContent = "Level 3 - Abgeschlossen";
    checkSymbol3.style.display = "inline";

    setTimeout(() => {
      alert("Herzlichen Glückwunsch! Du hast alle Level abgeschlossen!");
      resetGame();
    }, 2000);
  }
}

function startLevel2() {
  // Initialisiere Level 2
  brickRowCount = 3;
  brickColumnCount = 1;
  remainingBricks = brickRowCount * brickColumnCount;

  // Bricks neu initialisieren
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
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
  brickRowCount = 5;
  brickColumnCount = 7;
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, hits: 2 }; // 2 Treffer nötig
    }
  }
}

function startLevel3() {
  brickRowCount = 5;
  brickColumnCount = 7;
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, hits: 2 };
    }
  }
  remainingBricks = brickRowCount * brickColumnCount;
  // Ball und Paddle zurücksetzen
  x = canvas.width / 2;
  y = canvas.height - 30 - ballRadius;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
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
          const ballHitsTopOrBottom = x > b.x && x < b.x + brickWidth; // Ball trifft von oben/unten
          const ballHitsLeftOrRight = y > b.y && y < b.y + brickHeight; // Ball trifft von der Seite

          if (ballHitsTopOrBottom) {
            dy = -dy; // Vertikale Richtung umkehren
          } else if (ballHitsLeftOrRight) {
            dx = -dx; // Horizontale Richtung umkehren
          }

          b.status = 0; // Brick wird zerstört
          remainingBricks--; // Reduziere die Anzahl der verbleibenden Bricks

          // Prüfe, ob alle Bricks zerstört wurden
          if (remainingBricks === 0) {
            setTimeout(() => {
              nextLevel(); // Starte das nächste Level
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
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  // Zusätzliche Darstellung für Level 3 Bricks
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        ctx.beginPath();
        ctx.rect(b.x, b.y, brickWidth, brickHeight);
        if (currentLevel === 3 && b.hits === 2) {
          ctx.fillStyle = "#FFA500"; // Orange für 2 Treffer übrig
        } else {
          ctx.fillStyle = "#0095DD"; // Blau für 1 Treffer übrig
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
  // Spielstatus zurücksetzen
  isGameStarted = false;
  currentLevel = 1; // Zurücksetzen auf Level 1
  remainingBricks = brickRowCount * brickColumnCount; // Bricks zurücksetzen

  // Bricks neu initialisieren
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1; // Alle Bricks wieder aktiv setzen
    }
  }

  // Ball und Paddle zurücksetzen
  x = canvas.width / 2;
  y = canvas.height - 30 - ballRadius;
  dx = 0; // Keine horizontale Bewegung
  dy = -2; // Vertikale Bewegung nach oben
  paddleX = (canvas.width - paddleWidth) / 2;

  // Fortschritt zurücksetzen (für den Fall, dass du es brauchst)
  sessionStorage.setItem("arkanoidLevel", "1");
  currentLevel = 1;

  // Alle Status-Bars ausblenden und zurücksetzen
  document.getElementById("level-status-1").style.display = "none";
  document.getElementById("level-status-2").style.display = "none";
  document.getElementById("level-status-3").style.display = "none";

  document.getElementById("level-status-text-1").textContent =
    "Level 1 - Läuft";
  document.getElementById("check-symbol-1").style.display = "none";
  document.getElementById("level-status-text-2").textContent =
    "Level 2 - Läuft";
  document.getElementById("check-symbol-2").style.display = "none";
  document.getElementById("level-status-text-3").textContent =
    "Level 3 - Läuft";
  document.getElementById("check-symbol-3").style.display = "none";

  // Zeige die Ballauswahl
  document.getElementById("ball-selection").style.display = "block";
  document.getElementById("arkanoidCanvas").style.display = "none";
}

// Draw everything
function draw() {
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

      // Prüfe auf Kollision mit dem Paddle
      if (y + ballRadius > canvas.height - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          const paddleCenter = paddleX + paddleWidth / 2;
          const hitPosition = (x - paddleCenter) / (paddleWidth / 2); // Wert zwischen -1 und 1
          dx = hitPosition * 4; // Skaliere die horizontale Geschwindigkeit
          dy = -dy; // Vertikale Richtung umkehren
          break;
        } else {
          document.location.reload(); // Spiel vorbei
        }
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
