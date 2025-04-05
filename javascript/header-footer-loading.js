$(document).ready(function () {
    $("#footer").load("footer.html #footerLoad");
    $("#header").load("header.html #headerLoad");
});

document.addEventListener("mousemove", function (e) {
    const bee = document.querySelector(".bee-image");
    if (bee) {
        bee.style.transform = `translate(${e.pageX + 10}px, ${e.pageY + 10}px)`;
    }
});

