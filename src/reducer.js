const reducer = (state, action) => {
  switch(action.type) {

  case 'SET_IS_DRAGGING':
    return state = {
      ...state,
      isDragging: action.value
    };

  case 'SET_OPTIONS_PANEL_OPEN':
    return state = {
      ...state,
      isOptionsPanelOpen: action.value
    };

  case 'SET_SELECTED_INDEX':
    return state = {
      ...state,
      selectedIndex: action.value
    };

  case 'SET_LAST_SELECTED_INDEX':
    return state = {
      ...state,
      lastSelectedIndex: action.value
    };
  }
};

export default reducer;
