const toggleButton = document.getElementById('toggleMenu');
const navElement = document.getElementsByTagName('nav')[0];

function handleNav(target) {
  const navClasses = navElement.classList;
  if (!target || navClasses.contains('displayed')) {
    navClasses.remove('displayed');
    toggleButton.innerHTML = '\u2261';
  } else {
    navClasses.add('displayed');
    toggleButton.innerHTML = '\u2715';
  }
}

function handleClick(event) {
  if (navElement.contains(event.target)) {
    return;
  }
  handleNav(toggleButton.contains(event.target));
}

document.addEventListener('touchstart', handleClick);
