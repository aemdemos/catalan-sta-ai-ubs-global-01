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

// Create new div wrappers for each picture and add the appropriate classes
    pictures.forEach((picture, index) => {
      const divWrapper = document.createElement('div');
      divWrapper.classList.add('picture-wrapper');
      if (index === 0) {
        picture.classList.add('image-left');
        divWrapper.classList.add('left-picture-wrapper');
      } else if (index === 1) {
        picture.classList.add('image-right');
        divWrapper.classList.add('right-picture-wrapper');
      }
      divWrapper.appendChild(picture);
      images.appendChild(divWrapper);
    });

// Remove the original <p> wrapper
    const wrapper = images.querySelector('p');
    wrapper.remove();

    const content = document.createElement('div');
    content.className = 'event-item-content';

// Append body and images to the new div
    content.append(body, images);

    // decorate event item
    const details = document.createElement('details');
    details.className = 'event-item';
    details.append(summary, content);
    row.replaceWith(details);
  });
}
