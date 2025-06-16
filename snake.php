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
        <div class="valanglis-logo-container">
            <a href="index.php">
                <img class="valanglis-logo" src="./images/valanglis-logo-2.png" alt="valanglis-logo">
            </a>
        </div>

        <!-- wie beim Memory game -->
        <!--Difficulty selection area-->
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
            <canvas id="gameBoardSnake" width="500" height="500"></canvas>
        </div>
        <div id="scoreAndReset">
            <div id="scoreText">Score: 0</div>
            <button id="resetBtn">Reset</button>
        </div>
    </div>

    <div id="footer"></div>
    <script src="./javascript/Snake.js"></script>
</body>

</html>