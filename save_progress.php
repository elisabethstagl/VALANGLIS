<?php
// save_progress.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Stellen Sie sicher, dass der Benutzer angemeldet ist
if (!isset($_SESSION["id"])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["message" => "Not authenticated."]);
    exit();
}

include_once 'database/dbaccess.php'; // Pfad zu Ihrer Datenbankverbindung

header('Content-Type: application/json');

$userId = $_SESSION["id"]; // userId aus der PHP-Session
$gameId = $_POST["game_id"] ?? null; // Die ID für das Memory-Spiel
$levelReached = $_POST["level_reached"] ?? null;

// Stellen Sie sicher, dass game_id und level_reached vorhanden sind
if ($gameId === null || $levelReached === null) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Missing game_id or level_reached."]);
    exit();
}

// Optional: Validieren Sie game_id und level_reached (z.B. Integer-Typen)
$gameId = (int)$gameId;
$levelReached = (int)$levelReached;

// Zuerst prüfen, ob bereits ein Eintrag für diesen Benutzer und dieses Spiel existiert
$sqlCheck = "SELECT level_reached FROM progress WHERE user_id = ? AND game_id = ?";
$stmtCheck = $db->prepare($sqlCheck);
$stmtCheck->bind_param("ii", $userId, $gameId);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();

if ($resultCheck->num_rows > 0) {
    // Eintrag existiert, prüfen ob das neue Level höher ist
    $row = $resultCheck->fetch_assoc();
    $currentLevelInDb = $row['level_reached'];

    if ($levelReached > $currentLevelInDb) {
        // Aktualisieren, wenn das neue Level höher ist
        $sqlUpdate = "UPDATE progress SET level_reached = ? WHERE user_id = ? AND game_id = ?";
        $stmtUpdate = $db->prepare($sqlUpdate);
        $stmtUpdate->bind_param("iii", $levelReached, $userId, $gameId);
        if ($stmtUpdate->execute()) {
            echo json_encode(["message" => "Progress updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error updating progress: " . $stmtUpdate->error]);
        }
        $stmtUpdate->close();
    } else {
        // Kein Update nötig, da das gespeicherte Level bereits gleich oder höher ist
        echo json_encode(["message" => "Current progress is already at or above the provided level."]);
    }
} else {
    // Eintrag existiert nicht, neuen Eintrag hinzufügen
    $sqlInsert = "INSERT INTO progress (user_id, game_id, level_reached) VALUES (?, ?, ?)";
    $stmtInsert = $db->prepare($sqlInsert);
    $stmtInsert->bind_param("iii", $userId, $gameId, $levelReached);
    if ($stmtInsert->execute()) {
        echo json_encode(["message" => "Progress inserted successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error inserting progress: " . $stmtInsert->error]);
    }
    $stmtInsert->close();
}

$stmtCheck->close();
$db->close();
?>