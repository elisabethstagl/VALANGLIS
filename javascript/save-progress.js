function saveProgressToDatabase(gameID, level) {
    if (!IS_LOGGED_IN) {
        console.log("User not logged in, progress will not be saved to database.");
        return;
    }

    $.ajax({
        url: 'save-progress.php',
        type: 'POST',
        data: {
            game_id: gameID,
            level_reached: level
        },
        success: function(response) {
            console.log('Progress saved successfully:', response.message);
        },
        error: function(xhr, status, error) {
            console.error('Error saving progress:', xhr.responseText);
        }
    });
}