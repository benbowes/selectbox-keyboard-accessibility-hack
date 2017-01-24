import SelectBox from './SelectBox';

// START - Find elements in DOM with `select-box` class, and apply SelectBox()
[ ...document.querySelectorAll('.select-box') ].forEach((element) => {
  return new SelectBox(element);
});
