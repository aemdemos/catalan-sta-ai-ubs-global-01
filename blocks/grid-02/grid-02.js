export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`grid-02-${cols.length}-cols`);

  // setup image grid-02
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('grid-02-img-col');
        }
      }
    });
  });
}
