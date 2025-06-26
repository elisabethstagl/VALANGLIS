<?php
include 'initial.php';
$memoryGameId = 1;
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VALANGLIS - Memory</title>
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

        <div class="game-container">
            <h2 class="">Memory</h2>

            <div id="start-game-button">
                <button id="start-game" class="btn-retro">Start Game</button>
            </div>

            <div id="level-and-timer-wrapper">
                <div id="level-and-timer">
                    <span id="level-display">Level 1</span> |
                    <span id="timer">Time: 0.0s</span>
                </div>
                <div id="level-selector" class="level-selector"></div>
            </div>

            <div id="game-board"></div>
        </div>

    </div>

    <div id="footer"></div>

    <script src="./javascript/header-footer-loading.js"></script>
    <script>
        const MEMORY_GAME_ID = <?= $memoryGameId ?>;
        const IS_LOGGED_IN = <?= json_encode($loggedIn) ?>;
    </script>
    <script src="./javascript/save-progress.js"></script>
    <script src="./javascript/memory-game.js"></script>
</body>

</html>