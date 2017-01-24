// import sinon from 'sinon';
import { expect } from 'chai';
import reducer, { initialState } from './reducer';
import {
  SET_IS_DRAGGING,
  SET_OPTIONS_PANEL_OPEN,
  SET_SELECTED_INDEX,
  SET_LAST_SELECTED_INDEX
} from './actionTypes';

describe('reducer', () => {

  it('should update state.isDragging when SET_IS_DRAGGING is fired', () => {
    const result = reducer(undefined, { type: SET_IS_DRAGGING, value: true });
    expect(result).to.eql({
      ...initialState,
      isDragging: true
    });
  });

  it('should update state.isOptionsPanelOpen when SET_OPTIONS_PANEL_OPEN is fired', () => {
    const result = reducer(undefined, { type: SET_OPTIONS_PANEL_OPEN, value: true });
    expect(result).to.eql({
      ...initialState,
      isOptionsPanelOpen: true
    });
  });

  it('should update state.selectedIndex when SET_SELECTED_INDEX is fired', () => {
    const result = reducer(undefined, { type: SET_SELECTED_INDEX, value: 7 });
    expect(result).to.eql({
      ...initialState,
      selectedIndex: 7
    });
  });

  it('should update state.lastSelectedIndex when SET_LAST_SELECTED_INDEX is fired', () => {
    const result = reducer(undefined, { type: SET_LAST_SELECTED_INDEX, value: 6 });
    expect(result).to.eql({
      ...initialState,
      lastSelectedIndex: 6
    });
  });

});
