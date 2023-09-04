import createElement from '../../dom-helper/create-element';
import './modal-box.scss';
import { IPage } from '../../types/interfaces/page';

export default class ModalBox {
  private modalWrapper: HTMLDivElement;

  private backDrop: HTMLDivElement;

  private modalBox: HTMLDivElement;

  private boxContent: HTMLElement;

  private boxCloseBtn: HTMLSpanElement;

  constructor(component: IPage, config: string) {
    this.modalWrapper = createElement('div', { class: 'modal-box__wrapper' });
    this.backDrop = createElement('div', { class: 'backdrop' });
    this.modalBox = createElement('div', { class: `modal-box modal-box--${config}` });
    this.boxContent = createElement('div', { class: 'modal-box__content' });
    this.boxCloseBtn = createElement('span', { class: 'modal-box__close-btn' });
    this.boxCloseBtn.textContent = 'x';
    // this.boxContent.innerHTML = content.outerHTML;
    this.boxContent.append(component.render());
    this.modalBox.append(this.boxContent, this.boxCloseBtn);
    this.backDrop.append(this.modalBox);
    this.modalWrapper.append(this.backDrop);
    this.modalWrapper.addEventListener('click', this.handlerCloseModal.bind(this));
    document.body.append(this.modalWrapper);
  }

  private addListenerESC = (e: KeyboardEvent): void => {
    if (e.code === 'Escape' && this.modalWrapper?.classList.contains('modal-box--show')) {
      this.hide();
    }
  };

  private handlerCloseModal(e: MouseEvent): void {
    if (e.target instanceof Element) {
      if (e.target?.closest('.modal-box__close-btn') || e.target?.classList.contains('backdrop')) {
        this.hide();
      }
    }
  }

  public show(): void {
    this.modalWrapper.classList.add('modal-box--show');
    document.getElementsByTagName('html')[0].classList.add('overflow-hidden');
    document.addEventListener('keydown', this.addListenerESC);
  }

  public hide(): void {
    this.modalWrapper.classList.remove('modal-box--show');
    document.getElementsByTagName('html')[0].classList.remove('overflow-hidden');
    document.removeEventListener('keydown', this.addListenerESC);
  }
}
