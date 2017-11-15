const toggleButton = document.getElementById("toggleMenu");
const navElement = document.getElementsByTagName("nav")[0];
const displayClass = "displayed";

function toggleNav(forceHide) {
  const navClasses = navElement.classList;

  if (!forceHide || navClasses.contains(displayClass)) {
    navClasses.remove(displayClass);
    toggleButton.innerHTML = "\u2261";
  } else {
    navClasses.add(displayClass);
    toggleButton.innerHTML = "\u2715";
  }
}

function handleToggleMenu(event) {
  if (!navElement.contains(event.target)) {
    toggleNav(toggleButton.contains(event.target));
  }
}

document.addEventListener("touchstart", handleToggleMenu);
