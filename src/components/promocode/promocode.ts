import { Cart, DiscountCodeInfo, DiscountCodeReference } from '@commercetools/platform-sdk';
import createElement from '../../dom-helper/create-element';

import eventEmitter from '../../dom-helper/event-emitter';
import { getDiscountCodeById } from '../../services/ecommerce-api';
import deleteItem from '../../assets/image/delete.png';

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
    this.AppliedCode?.forEach((item, index) => {
      if (item.code === code) {
        indexCode = index;
      }
    });
    if (indexCode === -1) {
      this.AppliedCode?.push({ code, discountCodeReference });
      this.renderAllDiscountCode();
    }
  }

  public discountCodeMatch(itemDiscount: DiscountCodeInfo, code: string): void {
    getDiscountCodeById(itemDiscount.discountCode.id)
      .then((result): void => {
        if (result.code === code) {
          this.discountCodeReference = itemDiscount.discountCode;
          this.renderPromoCodeItem(code, this.discountCodeReference);
          if (itemDiscount.state === 'MatchesCart') {
            this.infoPromoCodeField.textContent = `The promocode ${code} was successfully applied!`;
          }
          if (itemDiscount.state === 'ApplicationStoppedByPreviousDiscount') {
            this.infoPromoCodeField.textContent = `The promocode ${code} was stopped by previous promocode`;
          }
        }
      })
      .catch();
  }

  private renderAllDiscountCode(): void {
    this.discountCodeItems.innerHTML = '';
    this.AppliedCode?.forEach((item, index) => {
      if (item && item.code && item.discountCodeReference) {
        const discountCodeItem = createElement('div', { class: 'discount-code__item' });
        discountCodeItem.textContent = `${item.code}`;
        const deleteCodeBtn = createElement<HTMLImageElement>('img', {
          class: 'discount-code__delete',
          src: deleteItem,
          alt: 'icon for delete promocode',
        });
        deleteCodeBtn.addEventListener('click', () => {
          if (item.discountCodeReference) this.deleteCode(item.discountCodeReference, index);
        });
        discountCodeItem.append(deleteCodeBtn);
        this.discountCodeItems.append(discountCodeItem);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public getItemsDiscountedPrice = (cart: Cart, lineItemId: string): string | undefined => {
    const listItem = cart.lineItems.find((item) => item.id === lineItemId);

    if (!listItem) {
      return undefined;
    }
    const discCodePrice = (listItem
      .discountedPricePerQuantity[0]
      .discountedPrice
      .value.centAmount as unknown as number
    );
    const currency = listItem.discountedPricePerQuantity?.[0].discountedPrice?.value.currencyCode;
    console.log(listItem, 'discCodePrice', discCodePrice);
    if (discCodePrice && currency) {
      return `${(discCodePrice / 100).toFixed(2)} ${currency}`;
    }
    return undefined;
  };

  private getCodeInput(): void {
    this.code = this.discountCodeInput?.value;
    eventEmitter.emit('event: changePromoCode', { code: this.code });
  }

  private deleteCode(discountCodeReference: DiscountCodeReference, index: number): void {
    if (discountCodeReference) {
      eventEmitter.emit('event: removePromoCode', { id: discountCodeReference.id, typeId: discountCodeReference.typeId });
      this.AppliedCode?.splice(index, 1);
      this.renderAllDiscountCode();
    }
  }
}
