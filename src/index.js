import 'babel-polyfill'; // For IE 11
import * as actionTypes from './actionTypes';
import reducer from './reducer';
import Hammer from 'hammerjs/hammer';

class SelectBox {

  constructor(element) {

    this.domRefs = {
      selectBox: element,
      optionNodes: element.querySelectorAll('.option'),
      label: element.querySelector('.label'),
      hiddenInputValue: element.querySelector('input[name]')
    };

    this.constants = {
      OPTION_NODES_LENGTH: this.domRefs.optionNodes.length
    };

    // Bind functions for listeners
    this.handleSelectBoxClick = this.handleSelectBoxClick.bind(this);
    this.handleSelectBoxBlur = this.handleSelectBoxBlur.bind(this);
    this.handleSelectBoxKeyEvent = this.handleSelectBoxKeyEvent.bind(this);

    this.setupStateManagement();
    this.addListeners();
    this.updateUI();
  }

  setupStateManagement() {
    this.state = reducer.initialState;

    // If this selectbox has an option with the class `selected` select it
    this.updateState({
      type: actionTypes.SET_SELECTED_INDEX,
      value: this.getInitialSelectedOptionIndex()
    });
  }

  addListeners() {
    // Let HammerJS deal with click/tap/press
    new Hammer(this.domRefs.selectBox).on('tap press', (e) => this.handleSelectBoxClick(e));
    // this.domRefs.label.addEventListener('click', this.handleSelectBoxClick, false);
    this.domRefs.selectBox.addEventListener('keydown', this.handleSelectBoxKeyEvent, false);
    this.domRefs.selectBox.addEventListener('blur', this.handleSelectBoxBlur, false);
  }

  updateUI() {
    const selectedOption = this.domRefs.optionNodes[this.state.selectedIndex];
    const previousOption = this.domRefs.optionNodes[this.state.lastSelectedIndex];

    // Select current selected option, deselect last selected option
    previousOption.classList.remove('selected');
    selectedOption.classList.add('selected');

    // Scroll to keep the selected option in view
    selectedOption.parentNode.scrollTop = selectedOption.offsetTop;

    // Set label and select-box form value
    this.domRefs.label.textContent = selectedOption.textContent;
    this.domRefs.hiddenInputValue.value = selectedOption.getAttribute('data-value');

    // Keep a reference of the current selectedIndex to use as lastSelectedIndex next time
    this.updateState({
      type: actionTypes.SET_LAST_SELECTED_INDEX,
      value: this.state.selectedIndex
    });
  }

  updateState(action) {
    this.state = reducer(this.state, action);
  }

  getInitialSelectedOptionIndex() {
    const initialSelectedOption = this.domRefs.selectBox.querySelector('.option.selected');
    return (initialSelectedOption)
      ? this.getOptionIndex(initialSelectedOption)
      : 0;
  }

  getNextIndex(mode) {
    const { isOptionsPanelOpen, selectedIndex } = this.state;
    const { OPTION_NODES_LENGTH } = this.constants;

    switch (mode) {
    case 'increment':
      return (() => {
        // Hold selection on current selected option when options panel first opens
        if (isOptionsPanelOpen === false) return selectedIndex;
        // User is at the end of the options so stay there
        if (selectedIndex === OPTION_NODES_LENGTH - 1) return OPTION_NODES_LENGTH - 1;
        // Else increment
        return selectedIndex + 1;
      })();

    case 'decrement':
      return (() => {
        // Hold selection on current selected option when options panel first opens
        if (isOptionsPanelOpen === false) return selectedIndex;
        // User is at start of the options so stay there
        if (selectedIndex === 0) return 0;
        // Else decrement
        return selectedIndex - 1;
      })();
    }
  }

  getOptionIndex(element) {
    // Find index of `child` relative to `parent`
    return Array.prototype.indexOf.call(element.parentNode.children, element);
  }

  toggleOptionsPanel(mode) {
    const { selectBox } = this.domRefs;

    switch (mode) {
    case 'open':
      // Open the options panel
      this.updateState({
        type: actionTypes.SET_OPTIONS_PANEL_OPEN,
        value: true
      });
      return selectBox.classList.add('options-container-visible');

    case 'close':
      // Close the options panel
      this.updateState({
        type: actionTypes.SET_OPTIONS_PANEL_OPEN,
        value: false
      });
      return selectBox.classList.remove('options-container-visible');

    default:
      // Toggle the options panel open or closed based on this.state.isOptionsPanelOpen
      if (this.state.isOptionsPanelOpen === false) {
        this.updateState({
          type: actionTypes.SET_OPTIONS_PANEL_OPEN,
          value: true
        });
        return selectBox.classList.add('options-container-visible');
      } else {
        this.updateState({
          type: actionTypes.SET_OPTIONS_PANEL_OPEN,
          value: false
        });
        return selectBox.classList.remove('options-container-visible');
      }
    }
  }

  // HANDLERS

  handleSelectBoxKeyEvent(e) {
    if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault(); // Disable native functionality
    }

    switch (e.keyCode) {
    case 13: // Enter
      e.stopPropagation(); // Do not submit form
      return this.toggleOptionsPanel();

    case 32: // Space
      return this.toggleOptionsPanel();

    case 27: // Esc
      return this.domRefs.selectBox.blur();

    case 38: // Up
      this.updateState({
        type: actionTypes.SET_SELECTED_INDEX,
        value: this.getNextIndex('decrement')
      });
      // Open the options panel
      if (this.state.isOptionsPanelOpen === false) {
        this.toggleOptionsPanel('open');
      }
      return this.updateUI();

    case 40: // Down
      this.updateState({
        type: actionTypes.SET_SELECTED_INDEX,
        value: this.getNextIndex('increment')
      });
      // Open the options panel
      if (this.state.isOptionsPanelOpen === false) {
        this.toggleOptionsPanel('open');
      }
      return this.updateUI();
    }
  }

  handleSelectBoxClick(e) {
    e && e.preventDefault();

    this.domRefs.selectBox.focus();

    // Clicked on a `.option` if e.target's parent is `.options`
    if (e && e.target.parentNode.classList.contains('options-container')) {
      this.updateState({
        type: actionTypes.SET_SELECTED_INDEX,
        value: this.getOptionIndex(e.target)
      });
      this.updateUI();
    }
    // Open panel if closed, close panel if open
    this.toggleOptionsPanel();
  }

  handleSelectBoxBlur() {
    this.toggleOptionsPanel('close');
  }
}

// START - Find elements in DOM with `select-box` class, and apply SelectBox()

const elements = document.querySelectorAll('.select-box');

for(let i=0; i<elements.length; i++) {
  new SelectBox(elements[i]);
}
//
// [ ...document.querySelectorAll('.select-box') ].forEach((element) => {
//   return new SelectBox(element);
// });
