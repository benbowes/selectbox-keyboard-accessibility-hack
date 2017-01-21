class SelectBox {

  constructor(element) {
    this.domRefs = {
      selectBox: element,
      optionNodes: element.querySelectorAll('.option'),
      label: element.querySelector('.label'),
      hiddenInputValue: element.querySelector('input[name]')
    };

    this.constants = {
      optionNodesLength: this.domRefs.optionNodes.length
    };

    this.state = {
      selectedIndex: this.getInitialSelectedOptionIndex(),
      lastSelectedIndex: 0,
      optionsOpen: false
    };

    // Bind functions for listeners
    this.handleSelectBoxBlur = this.handleSelectBoxBlur.bind(this);
    this.handleSelectBoxKeyEvent = this.handleSelectBoxKeyEvent.bind(this);
    this.handleSelectBoxClick = this.handleSelectBoxClick.bind(this);

    this.addListeners();
    this.updateUI();
  }

  updateState(action) {
    switch(action.type) {
    case 'SET_OPTIONS_OPEN': return this.state.optionsOpen = action.value;
    case 'SET_SELECTED_INDEX': return this.state.selectedIndex = action.value;
    case 'SET_LAST_SELECTED_INDEX': return this.state.lastSelectedIndex = action.value;
    }
  }

  addListeners() {
    this.domRefs.selectBox.addEventListener('touchstart', this.handleSelectBoxClick, false);
    this.domRefs.selectBox.addEventListener('mousedown', this.handleSelectBoxClick, false);
    this.domRefs.selectBox.addEventListener('keydown', this.handleSelectBoxKeyEvent, false);
    this.domRefs.selectBox.addEventListener('blur', this.handleSelectBoxBlur, false);
  }

  updateUI() {
    var selectedOption = this.domRefs.optionNodes[this.state.selectedIndex];
    var previousOption = this.domRefs.optionNodes[this.state.lastSelectedIndex];

    // Toggle option classes
    previousOption.classList.remove('selected');
    selectedOption.classList.add('selected');

    // Scroll to keep the selected option in view
    selectedOption.parentNode.scrollTop = selectedOption.offsetTop;

    // Set label and select-box form vale
    this.domRefs.label.textContent = selectedOption.textContent;
    this.domRefs.hiddenInputValue.value = selectedOption.getAttribute('data-value');
    this.updateState({ type: 'SET_LAST_SELECTED_INDEX', value: this.state.selectedIndex });
  }

  getInitialSelectedOptionIndex() {
    var initialSelectedOption = this.domRefs.selectBox.querySelector('.option.selected');
    return (initialSelectedOption)
      ? this.getOptionIndex(initialSelectedOption)
      : 0;
  }

  getNextIndex(mode) {
    switch (mode) {
    case 'increment':
      return (function(_this) {
        // hold selection on current selected option when options panel opens
        if (_this.state.optionsOpen === false) return _this.state.selectedIndex;
        // At the end of the list - stop
        if (_this.state.selectedIndex === _this.constants.optionNodesLength - 1) return _this.constants.optionNodesLength - 1;
        // else increment
        return _this.state.selectedIndex + 1;
      })(this);

    case 'decrement':
      return (function(_this) {
        // hold selection on current selected option when options panel opens
        if (_this.state.optionsOpen === false) return _this.state.selectedIndex;
        // reached the top of the list - stop
        if (_this.state.selectedIndex === 0) return 0;
        // else decrement
        return _this.state.selectedIndex - 1;
      })(this);
    }
  }

  getOptionIndex(element) {
    // Find index of `child` relative to `parent`
    return Array.prototype.indexOf.call(element.parentNode.children, element);
  }

  toggleOptionsPanel(mode) {
    switch (mode) {
    case 'open':
      this.updateState({ type: 'SET_OPTIONS_OPEN', value: true });
      return this.domRefs.selectBox.classList.add('options-container-visible');

    case 'close':
      this.updateState({ type: 'SET_OPTIONS_OPEN', value: false });
      return this.domRefs.selectBox.classList.remove('options-container-visible');

    default:
      if (this.state.optionsOpen === false) {
        this.updateState({ type: 'SET_OPTIONS_OPEN', value: true });
        return this.domRefs.selectBox.classList.add('options-container-visible');
      } else {
        this.updateState({ type: 'SET_OPTIONS_OPEN', value: false });
        return this.domRefs.selectBox.classList.remove('options-container-visible');
      }
    }
  }

  // HANDLERS

  handleSelectBoxKeyEvent(e) {
    if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 13) {
      e.preventDefault(); // Disable native functionality
    }

    switch (e.keyCode) {
    case 13: // Enter
      return this.toggleOptionsPanel();

    case 27: // Esc
      return this.domRefs.selectBox.blur();

    case 38: // Up
      this.updateState({ type: 'SET_SELECTED_INDEX', value: this.getNextIndex('decrement') });
      if (this.state.optionsOpen === false) this.toggleOptionsPanel('open');
      return this.updateUI();

    case 40: // Down
      this.updateState({ type: 'SET_SELECTED_INDEX', value: this.getNextIndex('increment') });
      if (this.state.optionsOpen === false) this.toggleOptionsPanel('open');
      return this.updateUI();
    }
  }

  handleSelectBoxClick(e) {
    // There are 2 events being fired. mousedown (desktop), touchstart (mobile).
    // Let the 1st cancel the other with `preventDefault`
    e && e.preventDefault();

    this.domRefs.selectBox.focus();

    // Clicked on a `.option` if its parent is `.options`
    if (e && e.target.parentNode.classList.contains('options-container')) {
      this.updateState({ type: 'SET_SELECTED_INDEX', value: this.getOptionIndex(e.target) });
      this.updateUI();
    }

    // Open panel if closed, close panel if open
    this.toggleOptionsPanel();
  }

  handleSelectBoxBlur() {
    this.toggleOptionsPanel('close');
  }

}

// START
[...document.querySelectorAll('.select-box')].forEach((element) => {
  return new SelectBox(element);
});