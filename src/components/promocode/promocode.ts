import { Cart, DiscountCodeInfo } from '@commercetools/platform-sdk';
import createElement from '../../dom-helper/create-element';

import eventEmitter from '../../dom-helper/event-emitter';
import { getDiscountCodeById } from '../../services/ecommerce-api';
import deleteItem from '../../assets/image/delete.png';
import { IPromoCode } from '../../types/interfaces/promocode';

export default class PromoCode {
  public static instance: PromoCode;

  constructor() {
    if (PromoCode.instance) {
      throw new Error("Singleton classes can't be instantiated more than once.");
    }
    PromoCode.instance = this;
  }

  private cartId?: string | null;

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

  public appliedCode?: IPromoCode[] = [];

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
    this.renderAllDiscountCode();
    this.discountCodeContainer.append(this.discountCodeItems);
    return this.discountCodeContainer;
  }

  public discountCodeMatch(itemDiscount: DiscountCodeInfo, code: string): void {
    getDiscountCodeById(itemDiscount.discountCode.id)
      .then((result): void => {
        if (result.code === code) {
          if (itemDiscount.state === 'MatchesCart') {
            this.infoPromoCodeField.textContent = `The promocode ${code} was successfully applied!`;
            this.infoPromoCodeField.classList.add('success');
            this.infoPromoCodeField.classList.remove('error');
          }
          if (itemDiscount.state === 'ApplicationStoppedByPreviousDiscount') {
            this.infoPromoCodeField.textContent = `The promocode ${code} was stopped by previous promocode`;
            this.infoPromoCodeField.classList.remove('success');
            this.infoPromoCodeField.classList.remove('error');
          }
        }
      })
      .catch((e) => {
        this.infoPromoCodeField.textContent = e.message;
        this.infoPromoCodeField.classList.remove('success');
        this.infoPromoCodeField.classList.add('error');
      });
  }

  public renderAllDiscountCode(): void {
    this.discountCodeItems.innerHTML = '';
    if (this.appliedCode && this.appliedCode.length > 0) {
      const headerPromoCodeList = createElement('div', { class: 'discount-code__header-list' });
      headerPromoCodeList.textContent = 'Applied codes:';
      this.discountCodeItems.append(headerPromoCodeList);
    }
    this.appliedCode?.forEach((item, index) => {
      if (item && item.discountCodeInfo) {
        if (!item.code) {
          getDiscountCodeById(item.discountCodeInfo.discountCode.id)
            .then((res) => {
              const codeName = res.code;
              this.renderDiscountItem(codeName, item, index);
            })
            .catch();
        } else this.renderDiscountItem(item.code, item, index);
      }
    });
  }

  private renderDiscountItem(code: string, item: IPromoCode, index: number): void {
    const discountCodeItem = createElement('div', { class: 'discount-code__item' });
    discountCodeItem.textContent = code;

    const deleteCodeBtn = createElement<HTMLImageElement>('img', {
      class: 'discount-code__delete',
      src: deleteItem,
      alt: 'icon for delete promocode',
    });
    deleteCodeBtn.addEventListener('click', () => {
      if (item.discountCodeInfo) this.deleteCode(item.discountCodeInfo, index);
    });
    discountCodeItem.append(deleteCodeBtn);
    this.discountCodeItems.append(discountCodeItem);
  }

  public static getItemsDiscountedPrice = (cart: Cart, lineItemId: string): string | undefined => {
    const listItem = cart.lineItems.find((item) => item.id === lineItemId);
    if (!listItem) {
      return undefined;
    }
    if (listItem.discountedPricePerQuantity.length > 0) {
      const discCodePrice = (
        listItem
          .discountedPricePerQuantity[0].discountedPrice?.value.centAmount as unknown as number
      );
      const currency = listItem.discountedPricePerQuantity?.[0].discountedPrice?.value.currencyCode;
      if (discCodePrice && currency) {
        return `${(discCodePrice / 100).toFixed(2)} ${currency}`;
      }
    }
    return undefined;
  };

  private getCodeInput(): void {
    this.code = this.discountCodeInput?.value;
    eventEmitter.emit('event: changePromoCode', { code: this.code });
  }

  private deleteCode(discountCodeInfo: DiscountCodeInfo, index: number): void {
    if (discountCodeInfo) {
      eventEmitter.emit('event: removePromoCode', { id: discountCodeInfo.discountCode.id, typeId: discountCodeInfo.discountCode.typeId });
      this.appliedCode?.splice(index, 1);
      this.renderAllDiscountCode();
    }
  }
}
