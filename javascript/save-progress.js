if (sessionStorage.getItem('memory-max-level') !== null) {
    saveProgressToDatabase(1, sessionStorage.getItem('memory-max-level'));
}

if (sessionStorage.getItem('snake-max-level') !== null) {
    saveProgressToDatabase(2, sessionStorage.getItem('snake-max-level'));
}

function saveProgressToDatabase(gameID, level) {
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