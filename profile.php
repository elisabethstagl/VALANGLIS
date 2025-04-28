<?php
$title = "Mein Profil";
include 'initial.php';

if (!$loggedIn) {
    header("Location: login.php");
    exit();
}

$errUsername = $errEmail = $errPassword = $successMsg = "";

// Profil updaten
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["update-profile"])) {
    $newUsername = trim($_POST["username"]) ?? "";
    $newEmail = trim($_POST["email"]) ?? "";

    if ($username != $newUsername) {
        if (empty($newUsername) || !preg_match("/^[a-zA-Z0-9-.]*$/", $newUsername)) {
            $errUsername = "Invalid username.";
        }
        else {
            $check_sql = "SELECT id FROM users WHERE username = ? AND id != ?";
            $stmt = $db->prepare($check_sql);
            $stmt->bind_param("si", $newUsername, $id);
            $stmt->execute();
            $stmt->store_result(); 
    
            if ($stmt->num_rows > 0) 
                $errUsername = "This username is taken.";
    
            $stmt->close(); 
        }

        if (empty($errUsername)) {
            $update_sql = "UPDATE users SET username = ? WHERE id = ?";
            $stmt = $db->prepare($update_sql);
            $stmt->bind_param("si", $newUsername, $id);
    
            if ($stmt->execute()) {
                $_SESSION["username"] = $newUsername;
                $username = $newUsername;
                $successMsg = "Profile updated successfully!";
            } else {
                $errUsername = "Error updating profile: " . $stmt->error;
            }
            $stmt->close();
        }
    }

    if ($email != $newEmail) {
        if (empty($newEmail) || !filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
            $errEmail = "Invalid email address.";
        }
        else {
            $check_sql = "SELECT id FROM users WHERE email = ? AND id != ?";
            $stmt = $db->prepare($check_sql);
            $stmt->bind_param("si", $newEmail, $id);
            $stmt->execute();
            $stmt->store_result(); 
    
            if ($stmt->num_rows > 0) 
                $errEmail = "This email address is already registered.";
    
            $stmt->close(); 
        }

        if (empty($errEmail)) {
            $update_sql = "UPDATE users SET email = ? WHERE id = ?";
            $stmt = $db->prepare($update_sql);
            $stmt->bind_param("si", $newEmail, $id);
    
            if ($stmt->execute()) {
                $_SESSION["email"] = $newEmail;
                $email = $newEmail;
                $successMsg = "Profile updated successfully!";
            } else {
                $errEmail = "Error updating profile: " . $stmt->error;
            }
    
            $stmt->close();
        }
    }


    // Passwort ändern (nur wenn ausgefüllt)
    if (!empty($_POST["current_password"]) && !empty($_POST["new_password"])) {
        $currentPassword = $_POST["current_password"];
        $newPassword = $_POST["new_password"];

        if (strlen($newPassword) < 4) {
            $errPassword = "Password must at least have 4 characters.";
        }
        else {
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
                    $errPassword = "Error updating password: " . $stmt->error;
                }
                $stmt->close();
            }
            else {
                $errPassword = "Current password is incorrect.";
            }
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
?>

<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="./css/styles.css">
</head>

<body>

    <div class="container">
        <div id="header"></div>

        <div class="d-flex justify-content-start align-items-center">
            <div class="form-box">
                <h4 style="text-align: left;">My Profile</h4>
                <?php
                    if (!empty($errUsername)) {
                ?>
                        <div class="alert alert-danger"><?= htmlspecialchars($errUsername) ?></div>
                <?php
                    }
                    if (!empty($errEmail)) {
                ?>
                        <div class="alert alert-success"><?= htmlspecialchars($errEmail) ?></div>
                <?php
                    }
                    if (!empty($errPassword)) {
                ?>
                    <div class="alert alert-danger"><?= htmlspecialchars($errPassword) ?></div>
                <?php
                    }
                    if (!empty($successMsg)) {
                ?>
                        <div class="alert alert-success"><?= htmlspecialchars($successMsg) ?></div>
                <?php
                    }
                ?>
                <form action="<?= htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" id="profileForm">
                    <div class="row">
                        <div class="col-12 col-lg-6 col-md-6 d-flex flex-column mb-3">
                            <label class="small-label" for="username">Username</label>
                            <input type="text" id="username" name="username" class="retro-input" required
                                value="<?= htmlspecialchars($username) ?>">
                        </div>

                        <div class="col-12 col-lg-6 col-md-6 d-flex flex-column mb-3">
                            <label class="small-label" for="email">Email</label>
                            <input type="email" id="email" name="email" class="retro-input" required
                                value="<?= htmlspecialchars($email) ?>">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-lg-6 col-md-6 d-flex flex-column mb-3">
                            <label class="small-label" for="current_password">Current Password</label>
                            <div class="input-wrapper position-relative">
                                <input type="password" id="current_password" name="current_password"
                                    class="retro-input">
                                <img src="./icons/eye.svg" class="toggle-password" data-toggle="#current_password"
                                    alt="Toggle Password">
                            </div>
                        </div>

                        <div class="col-12 col-lg-6 col-md-6 d-flex flex-column mb-3">
                            <label class="small-label" for="new_password">New Password</label>
                            <div class="input-wrapper position-relative">
                                <input type="password" id="new_password" name="new_password" class="retro-input">
                                <img src="./icons/eye.svg" class="toggle-password" data-toggle="#new_password"
                                    alt="Toggle Password">
                            </div>
                        </div>
                    </div>

                    <div class="d-flex gap-4 btn-container-save-del">
                        <button type="submit" class="btn-retro" name="update-profile">Save changes</button>
                        <button type="button" class="btn-retro profile-delete-btn" id="deleteProfileBtn">Delete
                            profile</button>
                    </div>
                </form>

            </div>
        </div>
    </div>

    <div id="footer"></div>

    <script src="./javascript/header-footer-loading.js"></script>
    <script src="./javascript/profile.js"></script>

    <!-- Delete Confirmation Modal -->
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