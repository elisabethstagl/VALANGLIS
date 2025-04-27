<?php
session_start();
$loggedIn = isset($_SESSION["id"]);
$username = $_SESSION["username"] ?? "";
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Header</title>
</head>

<body>

    <div class="header" id="headerLoad">
        <div class="valanglis-logo-container">
            <a href="index.php">
                <img class="valanglis-logo" src="./images/valanglis-logo-2.png" alt="valanglis-logo">
            </a>
        </div>

        <div class="user-icon-container d-flex align-items-center gap-2">
            <?php if ($loggedIn): ?>
                <div class="user-greeting-text">
                    Hello, <?= htmlspecialchars($username) ?>!
                </div>
            <?php endif; ?>
            <a href="<?= $loggedIn ? 'profile.php' : 'login.php'; ?>">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px"
                    viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                        <path d="M1800 4605 l0 -255 -255 0 -255 0 0 -770 0 -770 255 0 255 0 0 -255
                        0 -255 765 0 765 0 0 255 0 255 258 2 257 3 3 768 2 767 -260 0 -260 0 0 255
                        0 255 -765 0 -765 0 0 -255z m1530 -1025 l0 -770 -765 0 -765 0 0 770 0 770
                        765 0 765 0 0 -770z" />
                        <path d="M770 2045 l0 -255 -255 0 -255 0 2 -767 3 -768 2303 -3 2302 -2 0
                        770 0 770 -255 0 -255 0 0 255 0 255 -255 0 -255 0 0 -255 0 -255 255 0 255 0
                        0 -510 0 -510 -1795 0 -1795 0 0 510 0 510 260 0 260 0 0 255 0 255 -260 0
                        -260 0 0 -255z" />
                    </g>
                </svg>
            </a>

            <?php if ($loggedIn): ?>
                <a href="logout.php">
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px"
                        viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                            <path d="M1420 4190 l0 -160 -165 0 -165 0 0 -1470 0 -1470 165 0 165 0 0
                            -160 0 -160 650 0 650 0 0 160 0 160 -650 0 -650 0 0 1470 0 1470 650 0 650 0
                            0 160 0 160 -650 0 -650 0 0 -160z" />
                            <path d="M3050 3215 l0 -165 -655 0 -655 0 0 -490 0 -490 655 0 655 0 0 -165
                            0 -165 163 2 162 3 3 163 2 162 160 0 160 0 0 165 0 165 165 0 165 0 0 160 0
                            160 -165 0 -165 0 0 165 0 165 -160 0 -160 0 -2 163 -3 162 -162 3 -163 2 0
                            -165z m330 -330 l0 -165 160 0 160 0 0 -160 0 -160 -160 0 -160 0 0 -165 0
                            -165 -165 0 -165 0 0 165 0 165 -490 0 -490 0 0 160 0 160 490 0 490 0 0 165
                            0 165 165 0 165 0 0 -165z" />
                        </g>
                    </svg>
                </a>
            <?php endif; ?>
        </div>
    </div>

</body>

</html>