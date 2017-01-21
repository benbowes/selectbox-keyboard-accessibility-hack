/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	eval("class SelectBox {\n\n  constructor(element) {\n    this.domRefs = {\n      selectBox: element,\n      optionNodes: element.querySelectorAll('.option'),\n      label: element.querySelector('.label'),\n      hiddenInputValue: element.querySelector('input[name]')\n    };\n\n    this.constants = {\n      optionNodesLength: this.domRefs.optionNodes.length\n    };\n\n    this.state = {\n      selectedIndex: this.getInitialSelectedOptionIndex(),\n      lastSelectedIndex: 0,\n      optionsOpen: false\n    };\n\n    // Bind functions for listeners\n    this.handleSelectBoxBlur = this.handleSelectBoxBlur.bind(this);\n    this.handleSelectBoxKeyEvent = this.handleSelectBoxKeyEvent.bind(this);\n    this.handleSelectBoxClick = this.handleSelectBoxClick.bind(this);\n\n    this.addListeners();\n    this.updateUI();\n  }\n\n  updateState(action) {\n    switch (action.type) {\n      case 'SET_OPTIONS_OPEN':\n        return this.state.optionsOpen = action.value;\n      case 'SET_SELECTED_INDEX':\n        return this.state.selectedIndex = action.value;\n      case 'SET_LAST_SELECTED_INDEX':\n        return this.state.lastSelectedIndex = action.value;\n    }\n  }\n\n  addListeners() {\n    this.domRefs.selectBox.addEventListener('touchstart', this.handleSelectBoxClick, false);\n    this.domRefs.selectBox.addEventListener('mousedown', this.handleSelectBoxClick, false);\n    this.domRefs.selectBox.addEventListener('keydown', this.handleSelectBoxKeyEvent, false);\n    this.domRefs.selectBox.addEventListener('blur', this.handleSelectBoxBlur, false);\n  }\n\n  updateUI() {\n    var selectedOption = this.domRefs.optionNodes[this.state.selectedIndex];\n    var previousOption = this.domRefs.optionNodes[this.state.lastSelectedIndex];\n\n    // Toggle option classes\n    previousOption.classList.remove('selected');\n    selectedOption.classList.add('selected');\n\n    // Scroll to keep the selected option in view\n    selectedOption.parentNode.scrollTop = selectedOption.offsetTop;\n\n    // Set label and select-box form vale\n    this.domRefs.label.textContent = selectedOption.textContent;\n    this.domRefs.hiddenInputValue.value = selectedOption.getAttribute('data-value');\n    this.updateState({ type: 'SET_LAST_SELECTED_INDEX', value: this.state.selectedIndex });\n  }\n\n  getInitialSelectedOptionIndex() {\n    var initialSelectedOption = this.domRefs.selectBox.querySelector('.option.selected');\n    return initialSelectedOption ? this.getOptionIndex(initialSelectedOption) : 0;\n  }\n\n  getNextIndex(mode) {\n    switch (mode) {\n      case 'increment':\n        return function (_this) {\n          // hold selection on current selected option when options panel opens\n          if (_this.state.optionsOpen === false) return _this.state.selectedIndex;\n          // At the end of the list - stop\n          if (_this.state.selectedIndex === _this.constants.optionNodesLength - 1) return _this.constants.optionNodesLength - 1;\n          // else increment\n          return _this.state.selectedIndex + 1;\n        }(this);\n\n      case 'decrement':\n        return function (_this) {\n          // hold selection on current selected option when options panel opens\n          if (_this.state.optionsOpen === false) return _this.state.selectedIndex;\n          // reached the top of the list - stop\n          if (_this.state.selectedIndex === 0) return 0;\n          // else decrement\n          return _this.state.selectedIndex - 1;\n        }(this);\n    }\n  }\n\n  getOptionIndex(element) {\n    // Find index of `child` relative to `parent`\n    return Array.prototype.indexOf.call(element.parentNode.children, element);\n  }\n\n  toggleOptionsPanel(mode) {\n    switch (mode) {\n      case 'open':\n        this.updateState({ type: 'SET_OPTIONS_OPEN', value: true });\n        return this.domRefs.selectBox.classList.add('options-container-visible');\n\n      case 'close':\n        this.updateState({ type: 'SET_OPTIONS_OPEN', value: false });\n        return this.domRefs.selectBox.classList.remove('options-container-visible');\n\n      default:\n        if (this.state.optionsOpen === false) {\n          this.updateState({ type: 'SET_OPTIONS_OPEN', value: true });\n          return this.domRefs.selectBox.classList.add('options-container-visible');\n        } else {\n          this.updateState({ type: 'SET_OPTIONS_OPEN', value: false });\n          return this.domRefs.selectBox.classList.remove('options-container-visible');\n        }\n    }\n  }\n\n  // HANDLERS\n\n  handleSelectBoxKeyEvent(e) {\n    if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 13) {\n      e.preventDefault(); // Disable native functionality\n    }\n\n    switch (e.keyCode) {\n      case 13:\n        // Enter\n        return this.toggleOptionsPanel();\n\n      case 27:\n        // Esc\n        return this.domRefs.selectBox.blur();\n\n      case 38:\n        // Up\n        this.updateState({ type: 'SET_SELECTED_INDEX', value: this.getNextIndex('decrement') });\n        if (this.state.optionsOpen === false) this.toggleOptionsPanel('open');\n        return this.updateUI();\n\n      case 40:\n        // Down\n        this.updateState({ type: 'SET_SELECTED_INDEX', value: this.getNextIndex('increment') });\n        if (this.state.optionsOpen === false) this.toggleOptionsPanel('open');\n        return this.updateUI();\n    }\n  }\n\n  handleSelectBoxClick(e) {\n    // There are 2 events being fired. mousedown (desktop), touchstart (mobile).\n    // Let the 1st cancel the other with `preventDefault`\n    e && e.preventDefault();\n\n    this.domRefs.selectBox.focus();\n\n    // Clicked on a `.option` if its parent is `.options`\n    if (e && e.target.parentNode.classList.contains('options-container')) {\n      this.updateState({ type: 'SET_SELECTED_INDEX', value: this.getOptionIndex(e.target) });\n      this.updateUI();\n    }\n\n    // Open panel if closed, close panel if open\n    this.toggleOptionsPanel();\n  }\n\n  handleSelectBoxBlur() {\n    this.toggleOptionsPanel('close');\n  }\n\n}\n\n// START\n[...document.querySelectorAll('.select-box')].forEach(element => {\n  return new SelectBox(element);\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/index.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/index.js?");

/***/ }
/******/ ]);