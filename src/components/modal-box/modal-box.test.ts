import ModalBox from './modal-box';
import { IPage } from '../../types/interfaces/page';
// Mock a component for testing purposes
class MockComponent implements IPage {
  // eslint-disable-next-line class-methods-use-this
  public render(): HTMLElement {
    return document.createElement('div');
  }
}

describe('ModalBox', (): void => {
  let modal: ModalBox;
  beforeEach(() => {
    modal = new ModalBox(new MockComponent(), 'config');
  });
  afterEach(() => {
    modal.hide();
  });
  it('should show the modal', () => {
    modal.show();
    expect(document.body.contains(modal.modalWrapper)).toBe(true);
    expect(modal.modalWrapper.classList.contains('modal-box--show')).toBe(true);
    expect(document.getElementsByTagName('html')[0].classList.contains('overflow-hidden')).toBe(true);
  });

  it('should hide the modal', () => {
    modal.show();
    modal.hide();
    expect(modal.modalWrapper.classList.contains('modal-box--show')).toBe(false);
    expect(document.getElementsByTagName('html')[0].classList.contains('overflow-hidden')).toBe(false);
  });

  it('should handle ESC key press', () => {
    const event = new KeyboardEvent('keydown', { code: 'Escape' });
    modal.show();
    modal.addListenerESC(event); // You may need to cast the event type
    expect(modal.modalWrapper.classList.contains('modal-box--show')).toBe(false);
    expect(document.getElementsByTagName('html')[0].classList.contains('overflow-hidden')).toBe(false);
  });
});
