<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VALANGLIS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="icon" type="image/x-icon" href="./icons/favicon.ico">
</head>

<?php
include 'initial.php';
?>

<body>

    <div class="container text-center">

        <div id="header"></div>

        <div class="row games-container">
            <div class="col-md-4 col-sm-12">
                <a href="#" class="game-link">
                    <div class="game-div">Memory</div>
                </a>
            </div>
            <div class="col-md-4 col-sm-12">
                <a href="snake.php" class="game-link">
                    <div class="game-div">Snake</div>
                </a>
            </div>
            <div class="col-md-4 col-sm-12">
                <a href="#" class="game-link">
                    <div class="game-div">Ping-Pong</div>
                </a>
            </div>
        </div>

    </div>

    <img src="./images/bee.png" class="bee-image" alt="bee-image">

    <div id="footer"></div>

    <script src="./javascript/header-footer-loading.js"></script>
</body>



</html>