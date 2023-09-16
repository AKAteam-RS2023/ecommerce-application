import { DiscountCodeReference } from '@commercetools/platform-sdk';
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

  public discountCodeReference?: DiscountCodeReference;

  public infoPromoCodeField = createElement('div', { class: 'discount-code__info' });

  private discountCodeItems = createElement('div', { class: 'discount-code__items' });

  private discountCodeContainer = createElement('div', { class: 'discount-code__container' });

  private discountCodeInput = createElement<HTMLInputElement>('input', {
    class: 'discount-code__input',
    type: 'text',
    id: 'discountCode',
  });

  private applyCodeBtn = createElement<HTMLButtonElement>('button', {
    class: 'discount-code__submit',
  });

  private code = '';

  private AppliedCode?: {
    code?: string,
    discountCodeReference?: DiscountCodeReference,
  }[] = [];

  private init(): void {
    this.applyCodeBtn.textContent = 'Apply';
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
      this.applyCodeBtn,
    );
    this.discountCodeContainer.append(title, form, this.infoPromoCodeField);
    this.applyCodeBtn.onclick = this.getCodeInput.bind(this);
    this.discountCodeContainer.append(this.discountCodeItems);
    return this.discountCodeContainer;
  }

  public renderPromoCodeItem(code: string, discountCodeReference: DiscountCodeReference): void {
    let indexCode = -1;
    console.log(this.AppliedCode);
    this.AppliedCode?.forEach((item, index) => {
      if (item.code === code) {
        indexCode = index;
      }
    });
    if (indexCode > -1) {
      console.log('już jest');
    } else {
      this.AppliedCode?.push({ code, discountCodeReference });
      this.renderAllDiscountCode();
    }
  }

  private renderAllDiscountCode(): void {
    this.discountCodeItems.innerHTML = '';
    this.AppliedCode?.forEach((item) => {
      if (item && item.code && item.discountCodeReference) {
        const discountCodeItem = createElement('div', { class: 'discount-code__item' });
        discountCodeItem.textContent = `${item.code}`;
        const deleteCodeBtn = createElement<HTMLButtonElement>('button', {
          class: 'discount-code__delete',
        });
        deleteCodeBtn.textContent = 'Delete';
        deleteCodeBtn.addEventListener('click', () => {
          if (item.discountCodeReference) this.deleteCode(item.discountCodeReference);
        });
        this.discountCodeItems.append(discountCodeItem, deleteCodeBtn);
      }
    });
  }

  private getCodeInput(): void {
    this.code = this.discountCodeInput?.value;
    eventEmitter.emit('event: changePromoCode', { code: this.code });
  }

  private deleteCode(discountCodeReference: DiscountCodeReference): void {
    if (discountCodeReference) {
      eventEmitter.emit('event: removePromoCode', { id: discountCodeReference.id, typeId: discountCodeReference.typeId });
      this.AppliedCode?.pop();
      this.renderAllDiscountCode();
    }
  }
}
