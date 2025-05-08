<?php
$title = "Registrierung";
include 'initial.php';
include_once 'database/dbaccess.php';

$submitted = isset($_POST["register"]);

$username = $_POST["username"] ?? "";
$email = $_POST["email"] ?? "";
$password = $_POST["password"] ?? "";
$passwordRepeat = $_POST["password-repeat"] ?? "";

$errUsername = $errEmail = $errPassword = '';
$msg = '';

if ($submitted) {
    if (empty($username) || !preg_match("/^[a-zA-Z0-9-.]*$/", $username)) {
        $errUsername = "Username is missing or wrong";
    } else {
        $check_sql = "SELECT `id` FROM `users` WHERE `username` = ?";
        $stmt = $db->prepare($check_sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0)
            $errUsername = "This username is taken";
        $stmt->close();
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errEmail = "Email address is missing or wrong";
    } else {
        $check_sql = "SELECT `id` FROM `users` WHERE `email` = ?";
        $stmt = $db->prepare($check_sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0)
            $errEmail = "This email address is already registered";
        $stmt->close();
    }

    if ($password != $passwordRepeat) {
        $errPassword = "Passwords don't match";
    } else if (strlen($password) < 4) {
        $errPassword = "Password must at least have 4 characters";
    }

    if (empty($errUsername) && empty($errEmail) && empty($errPassword)) {
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $insert_sql = "INSERT INTO `users` (`username`, `email`, `password_hash`) VALUES (?, ?, ?)";
        $stmt = $db->prepare($insert_sql);
        $stmt->bind_param("sss", $username, $email, $password_hash);
        if ($stmt->execute())
            $msg = "Your registration was successfull!";
        else
            $msg = "Error: " . $stmt->error;

        $stmt->close();
        $db->close();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>REGISTRATION</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="icon" type="image/x-icon" href="./icons/favicon.ico">
</head>

<body>

    <div class="container">

        <div id="header"></div>

        <div class="d-flex justify-content-start align-items-center">
            <div class="form-box">
                <h4 style="text-align: left;">Create Account</h4>

                <?php if (!empty($msg)): ?>
                    <div class="alert alert-info">
                        <?= htmlspecialchars($msg) ?><br>
                        <a href="login.php">Login now!</a>
                    </div>
                <?php else: ?>

                    <form action="<?= htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                        <div class="row">
                            <div class="col-12 col-lg-4 col-md-6 d-flex flex-column mb-3">
                                <label class="small-label" for="username">Username</label>
                                <input type="text" id="username" name="username" class="retro-input <?php if ($submitted)
                                    echo empty($errUsername) ? 'is-valid' : 'is-invalid'; ?>" required
                                    value="<?= htmlspecialchars($username) ?>">
                                <div class="invalid-feedback"><?= $errUsername ?></div>
                            </div>

                            <div class="col-12 col-lg-4 col-md-6 d-flex flex-column mb-3">
                                <label class="small-label" for="email">Email</label>
                                <input type="email" id="email" name="email" class="retro-input <?php if ($submitted)
                                    echo empty($errEmail) ? 'is-valid' : 'is-invalid'; ?>" required
                                    value="<?= htmlspecialchars($email) ?>">
                                <div class="invalid-feedback"><?= $errEmail ?></div>
                            </div>



                            <div class="col-12 col-lg-4 col-md-6 d-flex flex-column mb-3">
                                <label class="small-label" for="password">Password</label>
                                <div class="input-wrapper position-relative">
                                    <input type="password" id="password" name="password"
                                        class="retro-input <?php if ($submitted)
                                            echo empty($errPassword) ? 'is-valid' : 'is-invalid'; ?>"
                                        required>
                                    <img src="./icons/eye.svg" class="toggle-password" data-toggle="#password"
                                        alt="Toggle Password">
                                </div>
                            </div>

                            <div class="col-12 col-lg-4 col-md-6 d-flex flex-column mb-3">
                                <label class="small-label" for="password-repeat">Repeat Password</label>
                                <div class="input-wrapper position-relative">
                                    <input type="password" id="password-repeat" name="password-repeat"
                                        class="retro-input <?php if ($submitted)
                                            echo empty($errPassword) ? 'is-valid' : 'is-invalid'; ?>"
                                        required>
                                    <img src="./icons/eye.svg" class="toggle-password" data-toggle="#password-repeat"
                                        alt="Toggle Password">
                                </div>
                                <div class="invalid-feedback d-block"><?= $errPassword ?></div>
                            </div>


                        </div>

                        <div class="text-start">
                            <button type="submit" class="btn-retro" name="register">Sign Up</button>
                        </div>

                    </form>

                <?php endif; ?>

            </div>
        </div>

        <img src="./images/cat-3.png" class="cat-image" alt="cat-image">
        <img src="./images/cat-2.png" class="cat-image-2" alt="cat-image-2">

    </div>

    <div id="footer"></div>

    <script src="./javascript/header-footer-loading.js"></script>
    <script src="./javascript/profile.js"></script>

</body>

</html>