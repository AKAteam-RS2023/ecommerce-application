import createElement from '../../dom-helper/create-element';
import { IModalOptions } from '../../types/interfaces/i-modal-options';
import './modal-box.scss';

export default class ModalBox {
  private modalWrapper: HTMLDivElement;

  private backDrop: HTMLDivElement;

  private modalBox: HTMLDivElement;

  private boxContent: HTMLElement;

  private boxCloseBtn: HTMLSpanElement;

  constructor(content: HTMLDivElement, options?: IModalOptions) {
    this.modalWrapper = createElement('div', { class: 'modal-box__wrapper' });
    this.backDrop = createElement('div', { class: 'backdrop' });
    this.modalBox = createElement('div', { class: 'modal-box' });
    this.boxContent = createElement('div', { class: 'modal-box__content' });
    this.boxCloseBtn = createElement('span', { class: 'modal-box__close-btn' });
    this.boxCloseBtn.textContent = 'x';
    this.boxContent.innerHTML = content.outerHTML;
    // this.boxContent.append();
    this.modalBox.append(this.boxContent, this.boxCloseBtn);
    this.backDrop.append(this.modalBox);
    this.modalWrapper.append(this.backDrop);
    this.modalWrapper.addEventListener('click', this.handlerCloseModal.bind(this));
    if (options?.width) {
      this.modalBox.style.width = `${options.width}px`;
    }
    if (options?.height) {
      this.modalBox.style.height = `${options.height}px`;
    }
    document.body.append(this.modalWrapper);
  }

  private handlerCloseModal(e: any): void {
    if (e.target.closest('.modal-box__close-btn') || e.target.classList.contains('backdrop')) {
      this.hide();
    }
  }

  public show(): void {
    this.modalWrapper.classList.add('modal-box--show');
  }

  public hide(): void {
    this.modalWrapper.classList.remove('modal-box--show');
  }
}
