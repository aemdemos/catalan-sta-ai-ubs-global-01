import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
  const upcomingEvents = block.querySelectorAll('.footer-navigation > div');
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
}
