import createElement from '../../dom-helper/create-element';

import { matchDiscountCode } from '../../services/ecommerce-api';

export default class PromoCode {
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

  private checkPromoCode(): void {
    if (this.cartId) {
      matchDiscountCode(this.cartId, this.code);
    }
  }

  public render(): HTMLElement {
    this.init();
    return this.discountCodeContainer;
  }

  private renderDiscountCode(): HTMLElement {
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
    this.enter.addEventListener('click', () => {
      this.code = this.discountCodeInput.value;
      if (!this.code) {
        return;
      }
      this.checkPromoCode();
    });
    return this.discountCodeContainer;
  }
}
