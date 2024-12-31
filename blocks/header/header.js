import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  // eslint-disable-next-line no-unused-expressions
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function openNav(nav, mobileSections) {
  mobileSections.classList.toggle('open');
  const button = nav.querySelector('.nav-hamburger button');
  const isOpen = mobileSections.classList.contains('open');
  button.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  button.style.backgroundImage = isOpen ? "url('../../../../icons/close.svg')" : "url('../../../../icons/burgermenu.svg')";
  document.body.classList.toggle('no-scroll', isOpen);
}

function toggleNav(nav, mobileSections) {
  mobileSections.classList.toggle('open');
  const button = nav.querySelector('.nav-hamburger button');
  const isOpen = mobileSections.classList.contains('open');
  button.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  button.style.backgroundImage = isOpen ? "url('../../../../icons/close.svg')" : "url('../../../../icons/burgermenu.svg')";
  document.body.classList.toggle('no-scroll', isOpen);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools', 'mobile-sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  // Add search icon under nav-brand default-content-wrapper
  const ubsLogo = document.createElement('img');
  ubsLogo.src = '../../../../icons/UBS_Logo_Semibold.svg';
  ubsLogo.alt = 'UBS Logo Semibold';
  ubsLogo.classList.add('ubs-logo-icon');
  const defaultContentWrapper = navBrand.querySelector('.default-content-wrapper');
  defaultContentWrapper.prepend(ubsLogo);

  const mobileSearchIcon = document.createElement('img');
  mobileSearchIcon.src = '../../../../icons/search.svg';
  mobileSearchIcon.alt = 'Search Icon';
  mobileSearchIcon.classList.add('mobile-search-icon');
  defaultContentWrapper.append(mobileSearchIcon);

  const navTools = nav.querySelector('.nav-tools');
  const brandToolsWrapper = document.createElement('div');
  brandToolsWrapper.classList.add('nav-brand-tools-wrapper');
  brandToolsWrapper.append(navBrand);
  brandToolsWrapper.append(navTools);
  nav.prepend(brandToolsWrapper);

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });

    const mobileSections = nav.querySelector('.nav-mobile-sections');
    mobileSections.querySelectorAll('ul li').forEach((item) => {
      if (item.querySelector('ul')) {
        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-btn';
        expandBtn.setAttribute('aria-label', 'Expand');
        expandBtn.innerHTML = '<span class="expand-list-icon"></span>';
        item.insertBefore(expandBtn, item.firstChild);
      }
    });

    mobileSections.querySelectorAll('ul li .expand-btn').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up to the parent li
        const listItem = button.closest('li');
        const siblingListItems = Array.from(listItem.parentElement.children);
        siblingListItems.forEach((item) => {
          if (item !== listItem) {
            item.classList.remove('expanded');
          }
        });
        listItem.classList.toggle('expanded');
      });
    });

    const conferencesLi = nav.querySelector('.nav-sections ul li.nav-drop ul');
    if (conferencesLi) {
      // Clone the nested ul
      const clonedUl = conferencesLi.cloneNode(true);
      // Create a new ul element
      const newUl = document.createElement('ul');
      newUl.classList.add('sublist-desktop');
      // Append the cloned ul to the new ul
      newUl.appendChild(clonedUl);
      // Append the new ul to the nav-sections
      navSections.appendChild(newUl);
    }

    // Add search icon
    const navSectionWrapper = nav.querySelector('.nav-sections .default-content-wrapper');
    const searchIcon = document.createElement('img');
    searchIcon.src = '../../../../icons/search.svg';
    searchIcon.alt = 'Search Icon';
    searchIcon.classList.add('search-icon');
    navSectionWrapper.append(searchIcon);
  }

  // hamburger for mobile
  const mobileSections = nav.querySelector('.nav-mobile-sections');
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  // hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  hamburger.addEventListener('click', () => toggleNav(nav, mobileSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
