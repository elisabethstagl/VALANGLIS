<?php
$title = "Logout";
include 'initial.php';

if ($loggedIn) {
    session_unset();
    session_destroy();
    header('Location: index.php');
    exit();
}
?>
