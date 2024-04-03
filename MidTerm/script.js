document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll("#newsLinks img");
    const menu = document.getElementById("menu");

    images.forEach(image => {
        image.addEventListener("mouseover", function() {
            const imageName = this.alt;
            menu.innerHTML = imageName;
        });

        // Optional: Reset the menu text when mouse leaves the image
        image.addEventListener("mouseout", function() {
            menu.innerHTML = "Menu";
        });
    });
});
