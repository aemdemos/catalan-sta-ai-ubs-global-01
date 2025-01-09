export default function decorate(block) {
  const upcomingEvents = block.querySelectorAll('.upcoming-events > div');
  upcomingEvents.forEach((event) => {
    const firstDiv = event.children[0];
    const secondDiv = event.children[1];
    if (firstDiv && secondDiv) {
      const pElement = firstDiv.querySelector('p');
      if (pElement) {
        const className = pElement.textContent.trim();
        secondDiv.classList.add(className);
      }
      firstDiv.remove(); // Remove the first div
    }
  });

  const regionDiv = document.querySelector('.region');
  if (regionDiv) {
    const listItems = regionDiv.querySelectorAll('ul li');
    listItems.forEach((li) => {
      li.classList.add('region-item');
    });
  }
}
