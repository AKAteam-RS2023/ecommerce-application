import createElement from '../../dom-helper/create-element';

import eventEmitter from '../../dom-helper/event-emitter';

export default class PromoCode {
  public static instance: PromoCode;

  constructor() {
    if (PromoCode.instance) {
      throw new Error("Singleton classes can't be instantiated more than once.");
    }
    PromoCode.instance = this;
  }

  private cartId?: string | null;

  private discountCodeContainer = createElement('div', { class: 'discount-code__container' });

  private discountCodeInput = createElement<HTMLInputElement>('input', {
    class: 'discount-code__input',
    type: 'text',
    id: 'discountCode',
  });

  private enter = createElement<HTMLButtonElement>('button', {
    class: 'discount-code__submit',
  });

  private code = '';

  private init(): void {
    this.enter.textContent = 'Apply';
    this.cartId = localStorage.getItem('cartId');
    this.renderDiscountCode();
  }

  public render(): HTMLElement {
    this.init();
    return this.discountCodeContainer;
  }

  private renderDiscountCode(): HTMLElement {
    this.discountCodeContainer.innerHTML = '';
    const title = createElement('div', { class: 'discount-code__title' });
    title.textContent = 'Promocode:';
    const form = createElement<HTMLFormElement>('form', { class: 'discount-code__form', type: 'submit' });
    form.addEventListener('submit', (e): void => {
      e.preventDefault();
    });
    form.append(
      this.discountCodeInput,
      this.enter,
    );
    this.discountCodeContainer.append(title, form);
    this.enter.onclick = this.getCodeInput.bind(this);
    return this.discountCodeContainer;
  }

  private getCodeInput(): void {
    this.code = this.discountCodeInput?.value;
    eventEmitter.emit('event: changePromoCode', { code: this.code });
  }
}
