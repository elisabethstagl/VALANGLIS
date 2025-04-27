<?php
session_start();
$title = "Login";
include 'initial.php';

$error = false;
$nameOrEmail = $_POST["nameOrEmail"] ?? "";

if (isset($_POST["login"])) {
    $uid = "";
    $uname = "";
    $uemail = "";
    $upwd = "";
    $uregdate = "";

    $sql = "SELECT * FROM users WHERE username = ? OR email = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("ss", $nameOrEmail, $nameOrEmail);
    $stmt->execute();
    $stmt->bind_result($uid, $uname, $uemail, $upwd, $uregdate);

    if ($stmt->fetch() && password_verify($_POST["password"], $upwd)) {
        $_SESSION["id"] = $uid;
        $_SESSION["username"] = $uname;
        $_SESSION["email"] = $uemail;
        $_SESSION["regDate"] = $uregdate;

        header('Location: index.php');
        exit();
    } else {
        $error = true;
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="icon" type="image/x-icon" href="./icons/favicon.ico">
</head>

<body>

    <div class="container">
        <div id="header"></div>

        <section>
            <div class="row d-flex align-items-center login-register-container">

                <div class="col-md-6 image-container d-flex flex-column">
                    <p class="register-callout">Want to track your game progress?</p>
                    <a class="register-text" href="registration.php">Sign up here!</a>
                </div>

                <div class="col-md-6 login-form-container d-flex justify-content-center align-items-center">
                    <div class="form-box">
                        <h4>Login</h4>

                        <?php if ($error): ?>
                            <div class="alert alert-danger">Wrong username, email or password!</div>
                        <?php endif; ?>

                        <form action="<?= htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                            <label for="nameOrEmail" class="small-label">Email or Username</label>
                            <input type="text" id="nameOrEmail" name="nameOrEmail" class="retro-input"
                                value="<?= htmlspecialchars($nameOrEmail) ?>" required>

                            <label for="password" class="small-label mt-3">Password</label>
                            <div class="position-relative">
                                <input type="password" id="password" name="password" class="retro-input pr-5" required>
                                <img src="./icons/eye.svg" class="toggle-password toggle-login" data-toggle="#password"
                                    alt="Toggle Password">
                            </div>

                            <div class="mt-4">
                                <button type="submit" class="btn-retro" name="login">Login</button>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        </section>

        <img src="./images/hero.png" class="img-fluid login-image" alt="hero-image">
    </div>

    <div id="footer"></div>

    <script src="./javascript/header-footer-loading.js"></script>
    <script src="./javascript/profile.js"></script>

</body>

</html>