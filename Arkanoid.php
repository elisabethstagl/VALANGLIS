<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arkanoid</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="icon" type="image/x-icon" href="./icons/favicon.ico">
</head>

<body>

    <div class="container text-center">
        <div id="header"></div>
        <h1>Arkanoid</h1>
        <p>Willkommen zum Arkanoid-Spiel! Viel Spaß!</p>
        <div id="ball-selection" class="text-center">
            <h2>Wähle deinen Ball</h2>
            <button class="btn btn-primary" onclick="selectBall('#0095DD')">Blauer Ball</button>
            <button class="btn btn-danger" onclick="selectBall('#FF0000')">Roter Ball</button>
            <button class="btn" onclick="selectBallImage('Ball1.png')">
                <img src="./images/Ball1.png" alt="Ball1" style="width: 50px; height: 50px;">
            </button>
            <button class="btn" onclick="selectBallImage('Ball2.png')">
                <img src="./images/Ball2.png" alt="Ball2" style="width: 50px; height: 50px;">
            </button>
        </div>

        <div id="level-popup" class="popup" style="display: none;">
            <p>Level 1 abgeschlossen!</p>
        </div>

        <div id="level-status-1" class="status-bar" style="display: none;">
            <span id="level-status-text-1">Level 1 - Läuft</span>
            <span id="check-symbol-1" class="check-symbol" style="display: none;">✔</span>
        </div>

        <div id="level-status-2" class="status-bar" style="display: none;">
            <span id="level-status-text-2">Level 2 - Läuft</span>
            <span id="check-symbol-2" class="check-symbol" style="display: none;">✔</span>
        </div>

        <div id="level-status-3" class="status-bar" style="display: none;">
            <span id="level-status-text-3">Level 3 - Läuft</span>
            <span id="check-symbol-3" class="check-symbol" style="display: none;">✔</span>
        </div>

        <canvas id="arkanoidCanvas" width="800" height="600" style="border:1px solid #000; display: none;" class="center-canvas"></canvas>
        <br>
        <a href="index.html" class="btn btn-primary mt-3">Zurück zur Startseite</a>
    </div>
    <div id="footer"></div>
    <script src="./javascript/arkanoid.js"></script>
    <script src="./javascript/header-footer-loading.js"></script>
</body>

</html>