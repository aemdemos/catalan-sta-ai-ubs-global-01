export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate event item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'event-item-label';
    summary.append(...label.childNodes);
    // decorate event item body
    const body = row.children[1];
    body.className = 'event-item-body';
    const images = row.children[2];
    images.className = 'event-item-img';

    const pictures = images.querySelectorAll('picture');

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

    const wrapper = images.querySelector('p');
    wrapper.remove();

    const content = document.createElement('div');
    content.className = 'event-item-content';

    content.append(body, images);

    // decorate event item
    const details = document.createElement('details');
    details.className = 'event-item';
    details.append(summary, content);
    row.replaceWith(details);
  });

  const recentEventsContainer = document.querySelector('.recent-events');

  if (recentEventsContainer) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'tabs-list';
    const eventItems = recentEventsContainer.querySelectorAll('.event-item');
    eventItems.forEach((eventItem, index) => {
      const summary = eventItem.querySelector('.event-item-label h3');
      if (summary) {
        const tabId = `tab-id-${index + 1}`; // Generate unique ID
        eventItem.id = tabId;
        const button = document.createElement('button');
        button.className = 'tabs-tab';
        button.id = tabId;

        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'arrow';

        const buttonText = document.createElement('p');
        buttonText.textContent = summary.textContent;
        button.appendChild(arrowSpan);
        button.appendChild(buttonText);
        buttonsContainer.appendChild(button);
      }
    });
    recentEventsContainer.insertBefore(buttonsContainer, recentEventsContainer.firstChild);
  }

  const tabs = document.querySelectorAll('.tabs-tab');
  const details = document.querySelectorAll('.event-item');
  // Open the first tab by default
  if (tabs.length > 0 && details.length > 0) {
    tabs[0].classList.add('active');
    details[0].setAttribute('open', 'open');
  }
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove('active'));
      // Close all details
      details.forEach((detail) => detail.removeAttribute('open'));
      // Add active class to the clicked tab
      tab.classList.add('active');
      // Open the corresponding details
      const correspondingDetail = document.querySelector(
        `.event-item#${tab.id}`,
      );
      if (correspondingDetail) {
        correspondingDetail.setAttribute('open', 'open');
      }
    });
  });

  details.forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        details.forEach((otherDetail) => {
          if (otherDetail !== detail) {
            otherDetail.removeAttribute('open');
          }
        });
      }
    });
  });
}
