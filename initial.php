<?php
    session_start();
    $loggedIn = isset($_SESSION["username"]);

    if ($loggedIn) {
        $id = $_SESSION["id"] ?? "";
        $username = $_SESSION["username"] ?? "";
        $email = $_SESSION["email"] ?? "";
        $regDate = $_SESSION["regDate"];
    }
    include_once 'config/dbaccess.php';
?>
<!DOCTYPE html>
<html lang="de" >
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?=$title;?></title>
    <link rel="icon" type="image/x-icon" href="img/logo-solo.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">
</head>