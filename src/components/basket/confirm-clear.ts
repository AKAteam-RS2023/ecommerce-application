import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';

export default class ConfirmClear implements IPage {
  private container = createElement('div', { class: 'clearcart__wrapper' });

  private onYes: () => void;

  private onNo: () => void;

  constructor(onYes: () => void, onNo: () => void) {
    this.onYes = onYes;
    this.onNo = onNo;
    this.init();
  }

  private init(): void {
    const header = createElement('div', { class: 'clearcart__header' });
    header.textContent = 'Are you sure you want to clear the cart?';
    const clearCartBtns = createElement('div', { class: 'clearcart__btns' });
    const yesBtn = createElement('div', { class: 'clearcart__btns--yes' });
    yesBtn.textContent = 'YES';
    yesBtn.addEventListener('click', () => this.onYes());
    const noBtn = createElement('div', { class: 'clearcart__btns--no' });
    noBtn.textContent = 'NO';
    noBtn.addEventListener('click', () => this.onNo());
    clearCartBtns.append(yesBtn, noBtn);
    this.container.append(header, clearCartBtns);
  }

  public render(): HTMLElement {
    return this.container;
  }
}
