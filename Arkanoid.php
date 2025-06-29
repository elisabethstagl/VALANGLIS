<?php
include 'initial.php';
$arkanoidGameId = 3;
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arkanoid</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="icon" type="image/x-icon" href="./icons/favicon.ico">
</head>


<body>

    <div class="container text-center">
        <div id="header"></div>

        <div class="game-content-container">
            <h1>Arkanoid</h1>
            <div class="center-select">
                <div>
                    <div id="ball-selection" class="text-center">
                        <h2>Wähle deinen Ball</h2>

                        <div>
                            <button class="btn btn-primary" onclick="selectBall('#0095DD')">Blauer Ball</button>
                            <button class="btn btn-danger" onclick="selectBall('#FF0000')">Roter Ball</button>
                        </div>
                    </div>

                    <div style="padding-top: 13px;">
                        <button class="level-button" id="arkanoid-btn-lv1">Lvl 1</button>
                        <button class="level-button locked" id="arkanoid-btn-lv2">Lvl 2</button>
                        <button class="level-button locked" id="arkanoid-btn-lv3">Lvl 3</button>
                    </div>
                    <!--<div id="level-popup" class="popup" style="display: none;">
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
                    </div>-->
                    <div class="game-container-arkanoid">
                        <canvas id="arkanoidCanvas" width="815" height="400" style="border:1px solid #000; display: none;"></canvas>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <div class="text-center">
        <a href="index.php" class="btn btn-primary mt-3">Zurück zur Startseite</a>
    </div>
    <div id="footer"></div>
    <script src="./javascript/header-footer-loading.js"></script>
    <script>
        const ARCANOID_GAME_ID = <?= $arkanoidGameId; ?>;
        const IS_LOGGED_IN = <?= json_encode($loggedIn); ?>;
    </script>
    <script src="./javascript/arkanoid.js"></script>
</body>

</html>