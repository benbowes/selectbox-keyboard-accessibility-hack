var SelectBox = function(element) {

  this.domRefs = {
    listBox: element,
    optionNodes: element.querySelectorAll('.option'),
    label: element.querySelector('.label'),
    hiddenInputValue: element.querySelector('input[name]')
  };

  this.constants = {
    optionElementsLength: this.domRefs.optionNodes.length,
  };

  this.state = {
    selectedIndex: this.getInitialSelectedOptionIndex(),
    lastSelectedIndex: 0,
    optionsOpen: false
  };

  // Bind functions for listeners
  this.handleListBoxOnBlur = this.handleListBoxOnBlur.bind(this);
  this.listItemKeyEvent = this.listItemKeyEvent.bind(this);
  this.listItemClick = this.listItemClick.bind(this);

  // Initialise
  this.addListeners();
  this.updateUI();
}

SelectBox.prototype = {

  updateState: function(action) {
    switch(action.type) {
      case 'SET_OPTIONS_OPEN':
        return this.state.optionsOpen = action.value;

      case 'SET_SELECTED_INDEX':
        return this.state.selectedIndex = action.value;

      case 'SET_LAST_SELECTED_INDEX':
        return this.state.lastSelectedIndex = action.value;
    }
  },

  addListeners: function() {
    this.domRefs.listBox.addEventListener('touchstart', this.listItemClick, false);
    this.domRefs.listBox.addEventListener('mousedown', this.listItemClick, false);
    this.domRefs.listBox.addEventListener('keydown', this.listItemKeyEvent, false);
    this.domRefs.listBox.addEventListener('blur', this.handleListBoxOnBlur, false);
  },

  updateUI: function() {
    this.domRefs.optionNodes[this.state.lastSelectedIndex].classList.remove('selected');
    this.domRefs.optionNodes[this.state.selectedIndex].classList.add('selected');
    this.domRefs.label.textContent = this.domRefs.optionNodes[this.state.selectedIndex].textContent;
    this.domRefs.hiddenInputValue.value = this.domRefs.optionNodes[this.state.selectedIndex].getAttribute('data-value');
    this.updateState({ type: 'SET_LAST_SELECTED_INDEX', value: this.state.selectedIndex });
  },

  getInitialSelectedOptionIndex: function() {
    var initialSelectedOption = this.domRefs.listBox.querySelector('.option.selected');
    return (initialSelectedOption)
      ? this.getChildIndex(initialSelectedOption)
      : 0;
  },

  handleListBoxOnBlur: function() {
    this.toggleOptionsPanel('closed');
  },

  getNextIndex: function(mode) {
    switch (mode) {
      case 'increment':
        return (function(_this) {
          // hold on current item to highlight it
          if (_this.state.optionsOpen === false) return _this.state.selectedIndex;
          // At the end of the list
          if (_this.state.selectedIndex === _this.constants.optionNodesLength - 1) return _this.constants.optionNodesLength - 1;
          // else increment
          return _this.state.selectedIndex + 1;
        })(this)

      case 'decrement':
        return (function(_this) {
          // hold on current item to highlight it
          if (_this.state.optionsOpen === false) return _this.state.selectedIndex;
          // reached the top of the list
          if (_this.state.selectedIndex === 0) return 0;
          // else decrement
          return _this.state.selectedIndex - 1;
        })(this)
    }
  },

  listItemKeyEvent: function(e) {
    if (e.keyCode === 40 || e.keyCode === 38) {
      e.preventDefault(); // Disable keyboard arrow scroll functionality
    }

    switch (e.keyCode) {
      case 13: // Enter
        return this.toggleOptionsPanel();

      case 40: // Down
        if (this.state.optionsOpen === false) this.toggleOptionsPanel('open');
        this.updateState({ type: 'SET_SELECTED_INDEX', value: this.getNextIndex('increment') });
        return this.updateUI();

      case 38: // Up
        if (this.state.optionsOpen === false) this.toggleOptionsPanel('open');
        this.updateState({ type: 'SET_SELECTED_INDEX', value: this.getNextIndex('decrement') });
        return this.updateUI();
    }
  },

  listItemClick: function(e) {
    // There are 2 events being fired. mousedown (desktop), touchstart (mobile).
    // Let the 1st cancel the other with `preventDefault`
    e && e.preventDefault();

    // no auto focus because `preventDefault` used above
    this.domRefs.listBox.focus();

    // Clicked on a `.option` if its parent is `.options`
    if (e && e.target.parentNode.classList.contains('options')) {
      this.updateState({ type: 'SET_SELECTED_INDEX', value: this.getChildIndex(e.target) });
      this.updateUI();
    }

    this.toggleOptionsPanel();
  },

  getChildIndex: function(element) {
    // Find index of `child` relative to `parent`
    return Array.prototype.indexOf.call(element.parentNode.children, element);
  },

  toggleOptionsPanel: function(mode) {
    switch (mode) {
      case 'open':
        this.updateState({ type: 'SET_OPTIONS_OPEN', value: true });
        return this.domRefs.listBox.classList.add('options-visible');

      case 'closed':
        this.updateState({ type: 'SET_OPTIONS_OPEN', value: false });
        return this.domRefs.listBox.classList.remove('options-visible');

      default:
        if (this.state.optionsOpen === false) {
          this.updateState({ type: 'SET_OPTIONS_OPEN', value: true });
          return this.domRefs.listBox.classList.add('options-visible');
        } else {
          this.updateState({ type: 'SET_OPTIONS_OPEN', value: false });
          return this.domRefs.listBox.classList.remove('options-visible');
        }
    }
  }
}

// Setup all .listbox instances
var listBoxes = document.querySelectorAll('.listbox');
for(var i = 0; i < listBoxes.length; i++) {
  new SelectBox(listBoxes[i]);
}
