<?php
include 'initial.php';

$gameName = 'Arkanoid';
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
            <h2>Arkanoid</h2>
            <div class="center-select">
                <div>
                    <div id="ball-selection" class="text-center">
                        <h4 class="ball-selection-title">Wähle deinen Ball</h4>

                        <div>
                            <button class="btn btn-primary" id="arkanoid-ball-blue">Blauer Ball</button>
                            <button class="btn btn-danger" id="arkanoid-ball-red">Roter Ball</button>
                        </div>
                    </div>

                    <div id="arkanoid-level-selection" style="display: none; padding-top: 13px;">
                        <button class="level-button" id="arkanoid-btn-lv1">Lvl 1</button>
                        <button class="level-button locked" id="arkanoid-btn-lv2">Lvl 2</button>
                        <button class="level-button locked" id="arkanoid-btn-lv3">Lvl 3</button>
                    </div>

                    <div class="game-container-arkanoid">
                        <canvas id="arkanoidCanvas" width="815" height="400"></canvas>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div id="footer"></div>
    <script>
        const ARKANOID_GAME_ID = <?= $gameID ?>;
    </script>
    <script src="./javascript/save-progress.js"></script>
    <script src="./javascript/arkanoid.js" defer></script>
    <script src="./javascript/header-footer-loading.js"></script>
</body>

</html>