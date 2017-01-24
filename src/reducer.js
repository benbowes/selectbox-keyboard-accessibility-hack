export const initialState = {
  isDragging: false,
  isOptionsPanelOpen: false,
  selectedIndex: 0,
  lastSelectedIndex: 0
};

const reducer = (state = initialState, action) => {
  switch(action.type) {

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
