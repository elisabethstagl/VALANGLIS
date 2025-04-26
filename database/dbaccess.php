<?php
    $host = "localhost";
    $user = "root"; // Standard-MySQL-Benutzer in XAMPP
    $password = ""; // Standard-Passwort (leer in XAMPP)
    $dbname = "valanglis";

    $db = new mysqli($host, $user, $password, $dbname);

    if ($db->connect_error) {
        echo "DB Error: " . $db->connect_error;
        die;
    }
?>
