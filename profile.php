<?php
$title = "My Profile";
include 'initial.php';

if (!$loggedIn) {
    header("Location: login.php");
    exit();
}

// Profil updaten
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["update-profile"])) {
    $newUsername = trim($_POST["username"]) ?? "";
    $newEmail = trim($_POST["email"]) ?? "";

    $errMsg = "";

    if (empty($newUsername) || !preg_match("/^[a-zA-Z0-9-.]*$/", $newUsername)) {
        $errMsg = "Invalid username.";
    }

    if (empty($newEmail) || !filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
        $errMsg = "Invalid email address.";
    }

    if (empty($errMsg)) {
        $update_sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
        $stmt = $db->prepare($update_sql);
        $stmt->bind_param("ssi", $newUsername, $newEmail, $id);

        if ($stmt->execute()) {
            $_SESSION["username"] = $newUsername;
            $_SESSION["email"] = $newEmail;
            $username = $newUsername;
            $email = $newEmail;
            $successMsg = "Profile updated successfully!";
        } else {
            $errMsg = "Error updating profile: " . $stmt->error;
        }

        $stmt->close();
    }

    // Passwort ändern (nur wenn ausgefüllt)
    if (!empty($_POST["current_password"]) && !empty($_POST["new_password"])) {
        $currentPassword = $_POST["current_password"];
        $newPassword = $_POST["new_password"];

        $getPasswordSql = "SELECT password_hash FROM users WHERE id = ?";
        $stmt = $db->prepare($getPasswordSql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($passwordHash);
        $stmt->fetch();
        $stmt->close();

        if (password_verify($currentPassword, $passwordHash)) {
            $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $updatePasswordSql = "UPDATE users SET password_hash = ? WHERE id = ?";
            $stmt = $db->prepare($updatePasswordSql);
            $stmt->bind_param("si", $newPasswordHash, $id);

            if ($stmt->execute()) {
                $successMsg = "Password updated successfully!";
            } else {
                $errMsg = "Error updating password: " . $stmt->error;
            }
            $stmt->close();
        } else {
            $errMsg = "Current password is incorrect.";
        }
    }
}

// Profil löschen
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["delete-profile"])) {
    $delete_sql = "DELETE FROM users WHERE id = ?";
    $stmt = $db->prepare($delete_sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        session_unset();
        session_destroy();
        header("Location: index.php");
        exit();
    } else {
        $errMsg = "Error deleting profile: " . $stmt->error;
    }

    $stmt->close();
}

// Progress-Daten abrufen
$progressData = [];
if ($loggedIn) {
    $progress_sql = "SELECT g.name, p.level_reached
                     FROM progress p
                     JOIN games g ON p.game_id = g.id
                     WHERE p.user_id = ?";
    $stmt = $db->prepare($progress_sql);
    if ($stmt) {
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $progressData[] = $row;
        }
        $stmt->close();
    } else {
        $errMsg = "Error preparing progress statement: " . $db->error;
    }
}
?>

<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title) ?></title>
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
    
    <div class="container">
        <div id="header"></div>
        <div class="row">
            <div class="col-12 col-xl-7 mb-5">
                <div class="form-box">
                    <h4 style="text-align: left;">My Profile</h4>

                    <?php if (!empty($errMsg)): ?>
                        <div class="alert alert-danger"><?= htmlspecialchars($errMsg) ?></div>
                    <?php elseif (!empty($successMsg)): ?>
                        <div class="alert alert-success"><?= htmlspecialchars($successMsg) ?></div>
                    <?php endif; ?>

                    <form action="<?= htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" id="profileForm">
                        <div class="row">
                            <div class="col-12 col-md-6 mb-3">
                                <label class="small-label" for="username">Username</label>
                                <input type="text" id="username" name="username" class="retro-input" required
                                    value="<?= htmlspecialchars($username) ?>">
                            </div>

                            <div class="col-12 col-md-6 mb-3">
                                <label class="small-label" for="email">Email</label>
                                <input type="email" id="email" name="email" class="retro-input" required
                                    value="<?= htmlspecialchars($email) ?>">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12 col-md-6 mb-3">
                                <label class="small-label" for="current_password">Current Password</label>
                                <div class="input-wrapper position-relative">
                                    <input type="password" id="current_password" name="current_password"
                                        class="retro-input">
                                    <img src="./icons/eye.svg" class="toggle-password" data-toggle="#current_password"
                                        alt="Toggle Password">
                                </div>
                            </div>

                            <div class="col-12 col-md-6 mb-3">
                                <label class="small-label" for="new_password">New Password</label>
                                <div class="input-wrapper position-relative">
                                    <input type="password" id="new_password" name="new_password" class="retro-input">
                                    <img src="./icons/eye.svg" class="toggle-password" data-toggle="#new_password"
                                        alt="Toggle Password">
                                </div>
                            </div>
                        </div>

                        <div class="d-flex btn-container-save-del">
                            <button type="submit" class="btn-retro" name="update-profile">Save changes</button>
                            <button type="button" class="btn-retro profile-delete-btn" id="deleteProfileBtn">Delete
                                profile</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="col-xl-1"></div>

            <div class="col-12 col-xl-4">
                <div class="form-box">
                    <h4>Highest Levels</h4>

                    <?php if (empty($progressData)): ?>
                        <p>No progress data found yet.</p>
                    <?php else: ?>
                        <div class="d-flex flex-column gap-2">
                            <?php foreach ($progressData as $progress): ?>
                                <div class="d-flex justify-content-between border-bottom pb-1">
                                    <span><?= htmlspecialchars($progress['name']) ?></span>
                                    <span class="text-end"><?= htmlspecialchars($progress['level_reached']) ?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <div id="footer"></div>

    <script src="./javascript/header-footer-loading.js"></script>
    <script src="./javascript/profile.js"></script>

    <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content form-box">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteConfirmModalLabel">Confirm Deletion</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete your profile? This action cannot be undone!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-retro" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn-retro profile-delete-btn" id="confirmDeleteBtn">Yes,
                        Delete</button>
                </div>
            </div>
        </div>
    </div>


</body>

</html>