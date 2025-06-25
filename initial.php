<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$loggedIn = isset($_SESSION["username"]);

if ($loggedIn) {
    $id = $_SESSION["id"] ?? "";
    $username = $_SESSION["username"] ?? "";
    $email = $_SESSION["email"] ?? "";
}

include_once 'database/dbaccess.php';
?>
