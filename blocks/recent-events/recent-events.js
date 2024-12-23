export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate event item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'event-item-label';``
    summary.append(...label.childNodes);
    // decorate event item body
    const body = row.children[1];
    body.className = 'event-item-body';
    const images = row.children[2];
    images.className = 'event-item-img';

    const pictures = images.querySelectorAll('picture');

    if (pictures.length >= 2) {
      pictures[0].classList.add('image-left');
      pictures[1].classList.add('image-right');
    }

    // decorate event item
    const details = document.createElement('details');
    details.className = 'event-item';
    details.append(summary, body, images);
    row.replaceWith(details);
  });
}
