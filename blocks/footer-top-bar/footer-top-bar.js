export default function decorate(block) {
  const youAreHereElement = block.querySelector('.footer-top-bar p');
  const breadcrumbList = block.querySelector('.footer-top-bar ul');

  if (youAreHereElement && breadcrumbList) {
    // Create a new wrapper div
    const wrapperDiv = document.createElement('div');
    wrapperDiv.className = 'footer-top-nav-wrapper'; // Add a class for styling if needed

    // Insert the wrapper div before the "You are here:" paragraph
    youAreHereElement.parentNode.insertBefore(wrapperDiv, youAreHereElement);

    // Move the "You are here:" paragraph and <ul> into the wrapper div
    wrapperDiv.appendChild(youAreHereElement);
    wrapperDiv.appendChild(breadcrumbList);
  }
}
