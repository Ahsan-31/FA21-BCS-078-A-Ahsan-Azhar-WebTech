const menuItem = document.getElementById('menu');
  const hoverImage = document.getElementById('IranImg');

  // Add event listener to the image for mouseover
  hoverImage.addEventListener('mouseover', function() {
    // Get the image name from the alt attribute
    const imageName = this.alt;
    // Update the menu item text with the image name
    menuItem.html = imageName;
  });

  // Add event listener to the image for mouseout (optional)
  hoverImage.addEventListener('mouseout', function() {
    // Reset the menu item text
    menuItem.html = 'Menu';
  });