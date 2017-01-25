import 'babel-polyfill'; // For IE 11
import * as actionTypes from './actionTypes';
import reducer from './reducer';
import isTouchDevice from './utils/isTouchDevice';
import getDOMChildIndex from './utils/getDOMChildIndex';

export default class SelectBox {

  constructor(selectBoxElement, formElement) {
    this.domRefs = {
      selectBox: selectBoxElement,
      formElement: formElement,
      optionNodes: selectBoxElement.querySelectorAll('.option'),
      label: selectBoxElement.querySelector('.label'),
      hiddenInputValue: selectBoxElement.querySelector('input[name]')
    };

    this.constants = {
      OPTION_NODES_LENGTH: this.domRefs.optionNodes.length
    };

    this.setupStateManagement();
    this.addListeners();
    this.updateUI();
    return this;
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
    this.domRefs.selectBox.addEventListener('blur', this.handleSelectBoxBlur.bind(this), false);

    if (isTouchDevice()) {
      this.domRefs.selectBox.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
      this.domRefs.selectBox.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
      this.domRefs.selectBox.addEventListener('touchend', this.handleSelectBoxClick.bind(this), false);
    } else {
      this.domRefs.selectBox.addEventListener('mousedown', this.handleSelectBoxClick.bind(this), false);
      this.domRefs.selectBox.addEventListener('keydown', this.handleSelectBoxKeyEvent.bind(this), true);
    }
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
    return this.state;
  }

  getInitialSelectedOptionIndex() {
    const initialSelectedOption = this.domRefs.selectBox.querySelector('.option.selected');
    return (initialSelectedOption)
      ? getDOMChildIndex(initialSelectedOption)
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

  toggleOptionsPanel(mode) {
    const { selectBox } = this.domRefs;

    switch (mode) {
    case 'open':
      // Open the options panel
      this.updateState({
        type: actionTypes.SET_OPTIONS_PANEL_OPEN,
        value: true
      });
      // Submit the form if the options panel is closed and enter is pressed
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

  handleTouchStart() {
    // initially it's assumed that the user is not dragging
    this.updateState({
      type: actionTypes.SET_IS_DRAGGING,
      value: false
    });
  }

  handleTouchMove() {
    // if touchmove fired - User is dragging
    this.updateState({
      type: actionTypes.SET_IS_DRAGGING,
      value: true
    });
  }

  handleSelectBoxKeyEvent(e) {

    // Apply e.preventDefault for these keyCodes
    this.preventDefaultForKeyCodes([13, 32, 27, 38, 40], e);

    switch (e.keyCode) {
    case 13: // Enter
      /*
      * can close the panel when open and focussed
      * can submit the form when closed and focussed
      */
      return this.enterPressed(e);

    case 32: // Space
      /*
      * can open or close the panel when focussed
      */
      return this.toggleOptionsPanel();

    case 27: // Esc
      /*
      * remove focus from the panel when focussed
      */
      return this.domRefs.selectBox.blur();

    case 38: // Up
      /*
      * will open the options panel if closed
      * will not decrement selection if options panel closed
      * if panel open will decrement up the options list and update ui
      */
      return this.keyUpOrDownPressed('decrement');

    case 40: // Down
      /*
      * will open the options panel if closed
      * will not increment selection if options panel closed
      * if panel open will increment down the options list and update ui
      */
      return this.keyUpOrDownPressed('increment');

    }
  }

  handleSelectBoxClick(e) {
    // Ignore click and touchend if user is dragging
    if(this.state.isDragging === false) {
      e && e.preventDefault();

      this.domRefs.selectBox.focus();

      // Clicked on a `.option` if its parent is `.options`
      if (e && e.target.parentNode.classList.contains('options-container')) {
        this.updateState({
          type: actionTypes.SET_SELECTED_INDEX,
          value: getDOMChildIndex(e.target)
        });
        this.updateUI();
      }
      // Open panel if closed, close panel if open
      this.toggleOptionsPanel();
    }
  }

  handleSelectBoxBlur() {
    this.toggleOptionsPanel('close');
  }

  // HANDLER HELPERS

  // Disable native functionality if keyCode match
  preventDefaultForKeyCodes(keyCodes, e) {
    keyCodes.forEach(keyCode => {
      if(keyCode === e.keyCode) e.preventDefault();
    });
  }

  enterPressed(e) {
    if (this.state.isOptionsPanelOpen === true) {
      e.stopPropagation(); // Do not submit form
      return this.toggleOptionsPanel('close'); // Close the panel
    }
    return this.domRefs.formElement.submit(); // Submit the form
  }

  keyUpOrDownPressed(type) {
    this.updateState({
      type: actionTypes.SET_SELECTED_INDEX,
      value: this.getNextIndex(type)
    });
    // Open the options panel
    if (this.state.isOptionsPanelOpen === false) {
      this.toggleOptionsPanel('open');
    }
    return this.updateUI();
  }

}
