<?php
include 'initial.php';

if (!$loggedIn) {
    http_response_code(401); // Unauthorized
    echo json_encode(["message" => "Not authenticated."]);
    exit();
}

header('Content-Type: application/json');

$gameId = $_POST["game_id"] ?? null;
$levelReached = $_POST["level_reached"] ?? null;

// Zuerst prüfen, ob bereits ein Eintrag für diesen Benutzer und dieses Spiel existiert
$sqlCheck = "SELECT level_reached FROM progress WHERE user_id = ? AND game_id = ?";
$stmtCheck = $db->prepare($sqlCheck);
$stmtCheck->bind_param("ii", $id, $gameId);
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
        $stmtUpdate->bind_param("iii", $levelReached, $id, $gameId);
        if ($stmtUpdate->execute()) {
            echo json_encode(["message" => "Progress updated successfully."]);
        } else {
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
    $stmtInsert->bind_param("iii", $id, $gameId, $levelReached);
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