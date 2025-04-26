<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LOGIN</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="./css/styles.css">
</head>

<?php
    session_start();
    $title = "Login";
    include 'initial.php'; // <- Dein DB-Connect etc.

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

<body>

    <div class="container">

        <div id="header"></div>
        <section>
            <div class="row d-flex align-items-center login-register-container">

                <div class="col-md-6 image-container d-flex flex-column">
                    <p class="register-callout">
                        Want to track your game progress?
                    </p>
                    <a class="register-text" href="register.html">Register here!</a>
                </div>

                <div class="col-md-6 login-form-container d-flex justify-content-center align-items-center">
                    <div class="form-box">
                        <h4>Login</h4>

                        <!-- Fehleranzeige -->
                        <?php if ($error): ?>
                            <div class="alert alert-danger">Username, E-Mail oder Passwort falsch!</div>
                        <?php endif; ?>

                        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                            <label for="nameOrEmail" class="small-label">E-Mail oder Benutzername</label>
                            <input type="text" id="nameOrEmail" name="nameOrEmail" class="retro-input" 
                                placeholder="magicBob oder email@example.com" 
                                value="<?= htmlspecialchars($nameOrEmail) ?>" required>

                            <label for="password" class="small-label mt-3">Passwort</label>
                            <input type="password" id="password" name="password" class="retro-input" placeholder="*****" required>

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

</body>

</html>
