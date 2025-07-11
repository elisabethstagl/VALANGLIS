<?php
include 'initial.php';

$gameName = 'Snake';
$sql = "SELECT id FROM games WHERE name = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("s", $gameName);
$stmt->execute();
$stmt->bind_result($gameID);
$stmt->fetch();
$stmt->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VALANGLIS - Snake</title>
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
        <!--Logo area-->
        <div id="header"></div>

        <!--Difficulty selection area-->
        <h2>Snake</h2>
        <div id="difficulty-selector" class="mt-4">
            <label for="difficulty">level: </label>
            <select id="difficulty">
                <option value="easy" selected>easy</option>
                <option value="medium" disabled>medium (locked)</option>
                <option value="hard" disabled>hard (locked)</option>
            </select>
            <button id="start-game" class="btn btn-primary">GO</button>
        </div>
        
        <!--Game area-->
        <div id="gameContainerSnake">
            <canvas id="gameBoardSnake"></canvas>
        </div>
        <div id="touch-controls">
            <div class="row-controls">
                <button class="btn-touch" data-dir="up">⬆️</button>
            </div>
            <div class="row-controls">
                <button class="btn-touch" data-dir="left">⬅️</button>
                <button class="btn-touch" data-dir="down">⬇️</button>
                <button class="btn-touch" data-dir="right">➡️</button>
            </div>
        </div>

        <div id="scoreAndReset" class="fixed-panel">
            <div id="scoreText">Score: 0</div>
            <button id="resetBtn">Reset</button>
        </div>
        <div id="info" class="fixed-panel hidden">
        </div>
    </div>

    <div id="footer"></div>

    <script src="./javascript/header-footer-loading.js"></script>
    <script>
        const SNAKE_GAME_ID = <?= $gameID ?>;
    </script>
    <script src="./javascript/save-progress.js"></script>
    <script src="./javascript/snake.js"></script>
</body>

</html>