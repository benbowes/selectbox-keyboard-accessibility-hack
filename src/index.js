import SelectBox from './SelectBox';

// Find form element
const formElement = document.querySelector('#customSelectForm');

// Find elements with `select-box` class and apply `SelectBox`
[ ...document.querySelectorAll('.select-box') ].forEach((selectBoxElement) => {
  /*
  * @param {HTML Element} element
  * @param {HTML Element} formElement - used for submitting form
  */
  return new SelectBox(selectBoxElement, formElement);
});
