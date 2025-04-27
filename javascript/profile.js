document.addEventListener("DOMContentLoaded", function () {
    const deleteProfileBtn = document.getElementById("deleteProfileBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const profileForm = document.getElementById("profileForm");

    if (deleteProfileBtn && confirmDeleteBtn && profileForm) {
        deleteProfileBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
            deleteModal.show();
        });

        confirmDeleteBtn.addEventListener("click", function () {
            const hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "delete-profile";
            hiddenInput.value = "1";
            profileForm.appendChild(hiddenInput);

            profileForm.submit();
        });
    }
});


document.querySelectorAll('.toggle-password').forEach(function (icon) {
    icon.addEventListener('click', function () {
        const input = document.querySelector(this.dataset.toggle);
        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
        }
    });
});
