$(document).ready(function () {
    $("#footer").load("footer.php #footerLoad");
    $("#header").load("header.php #headerLoad");
});

document.addEventListener("mousemove", function (e) {
    const bee = document.querySelector(".bee-image");
    if (bee) {
        bee.style.transform = `translate(${e.pageX + 10}px, ${e.pageY + 10}px)`;
    }
});

