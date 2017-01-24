import sinon from 'sinon';
import jsdom from 'jsdom';
import { expect } from 'chai';
import SelectBox from './SelectBox';

let SelectBoxInstance;
let DOM;

function triggerMouseEvent (element, eventType) {
  const MouseEvent = document.createEvent('MouseEvents');
  MouseEvent.initEvent (eventType, true, true);
  element.dispatchEvent (MouseEvent);
}

describe('SelectBox', () => {

  beforeEach((beforeEachDone) => {
    jsdom.env({
      html: `
      <div role="listbox" tabindex="0" class="select-box">
          <div class="label-container">
            Make: <span class="label">Any</span>
            <i class="icon fa fa-angle-down" aria-hidden="true"></i>
          </div>
          <div class="options-container">
            <div role="option" class="option" data-value="null">Any</div>
            <div role="option" class="option" data-value="fiat">Fiat</div>
            <div role="option" class="option selected" data-value="subaru">Subaru</div>
            <div role="option" class="option" data-value="bmw">BMW</div>
            <div role="option" class="option" data-value="tesla">Tesla</div>
          </div>
          <input type="hidden" name="colour" value="null" />
        </div>
      </div>
      `,
      done: (err, window) => {
        if (err) throw err;
        DOM = window.document.querySelector('.select-box');
        SelectBoxInstance = new SelectBox(DOM);
        beforeEachDone();
      }
    });
  });

  it('should initialise correctly', () => {
    expect(SelectBoxInstance.domRefs.selectBox.getAttribute('role')).to.equal('listbox');
    expect(SelectBoxInstance.domRefs.optionNodes.length).to.equal(5);
    expect(SelectBoxInstance.constants.OPTION_NODES_LENGTH).to.equal(5);
  });

  it('should select option with .selected class', () => {
    expect(SelectBoxInstance.state.selectedIndex).to.equal(2);
  });

  it('should select first option when no .selected class', (itDone) => {
    jsdom.env({
      html: `
      <div role="listbox" tabindex="0" class="select-box">
          <div class="label-container">
            Make: <span class="label">Any</span>
            <i class="icon fa fa-angle-down" aria-hidden="true"></i>
          </div>
          <div class="options-container">
            <div role="option" class="option" data-value="null">Any</div>
            <div role="option" class="option" data-value="fiat">Fiat</div>
            <div role="option" class="option" data-value="subaru">Subaru</div>
          </div>
          <input type="hidden" name="colour" value="null" />
        </div>
      </div>
      `,
      done: (err, window) => {
        if (err) throw err;
        DOM = window.document.querySelector('.select-box');
        SelectBoxInstance = new SelectBox(DOM);

        expect(SelectBoxInstance.state.selectedIndex).to.equal(0);

        window.close();
        itDone();
      }
    });
  });

  it('it should toggle the options panel when mousedown fired', () => {
    const stub = sinon.stub(SelectBoxInstance, 'updateState');
    triggerMouseEvent(SelectBoxInstance.domRefs.selectBox, 'mousedown');
    expect(stub.firstCall.args[0]).to.eql({ type: 'SET_OPTIONS_PANEL_OPEN', value: true });

    triggerMouseEvent(SelectBoxInstance.domRefs.selectBox, 'mousedown');
    expect(stub.secondCall.args[0]).to.eql({ type: 'SET_OPTIONS_PANEL_OPEN', value: false });
  });

  afterEach((afterEachDone) => {
    DOM = undefined;
    SelectBoxInstance = undefined;
    jsdom.env({
      html: '',
      done: (err) => {
        if (err) throw err;
        window.close();
        afterEachDone();
      }
    });
  });

});
