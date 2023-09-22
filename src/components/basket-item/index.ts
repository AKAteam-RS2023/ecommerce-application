import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import ICartsProduct from '../../types/carts-product';

import notImage from '../../assets/image/image-not-found.png';
import deleteItem from '../../assets/image/delete.png';

import './basket-item.scss';

const MIN_VALUE = 0;

const MAX_VALUE = 100;

export default class BasketItem {
  private container = createElement('div', { class: 'basket__item' });

  private quantityInput = createElement<HTMLInputElement>('input', {
    type: 'number',
    value: `${this.product.quantity}`,
    min: `${MIN_VALUE}`,
    max: `${MAX_VALUE}`,
    class: 'basket__item--quantity',
  });

  private totalPrice = createElement('div', { class: 'basket__item--total-price' });

  private priceWithPromoCode = createElement('div', { class: 'basket__item--discount-code-price' });

  private deleteBtn = createElement<HTMLImageElement>('img', {
    class: 'basket__item--delete',
    src: deleteItem,
    alt: 'icon for delete product',
  });

  constructor(public product: ICartsProduct) {
    this.product = product;
    this.initQuantity();
    this.initDeleteBtn();
    this.init();
    eventEmitter.subscribe('event: change-item-quantity', (data) => {
      if (!data || !('lineItemId' in data) || data.lineItemId !== this.product.lineItemId) {
        return;
      }
      this.product.quantity = +data.quantity;
      this.quantityInput.value = data.quantity;
    });
    eventEmitter.subscribe('event: change-item-total-price', (data) => {
      if (!data || !('lineItemId' in data) || data.lineItemId !== this.product.lineItemId) {
        return;
      }
      this.product.totalPrice = data.price;
      this.totalPrice.textContent = data.price;
    });
    eventEmitter.subscribe('event: change-item-discount-price', (data) => {
      if (!data || !('lineItemId' in data) || data.lineItemId !== this.product.lineItemId) {
        return;
      }
      this.product.priceWithPromoCode = data.price;
      this.priceWithPromoCode.textContent = data.price;
    });
    eventEmitter.subscribe('event: remove-item', (data) => {
      if (!data || !('lineItemId' in data) || data.lineItemId !== this.product.lineItemId) {
        return;
      }
      this.container.remove();
    });
  }

  private onChange = (): void => {
    if (+this.quantityInput.value === this.product.quantity) {
      return;
    }
    if (+this.quantityInput.value < MIN_VALUE) {
      this.quantityInput.value = '1';
    }
    if (+this.quantityInput.value > MAX_VALUE) {
      this.quantityInput.value = `${MAX_VALUE}`;
    }
    if (+this.quantityInput.value === 0) {
      eventEmitter.emit('event: remove-item-from-cart', {
        lineItemId: this.product.lineItemId,
        quantity: `${this.product.quantity}`,
      });
      return;
    }
    eventEmitter.emit('event: change-quantity', {
      quantity: this.quantityInput.value,
      lineItemId: this.product.lineItemId,
    });
  };

  private onDelete = (): void => {
    eventEmitter.emit('event: remove-item-from-cart', {
      lineItemId: this.product.lineItemId,
      quantity: `${this.product.quantity}`,
    });
  };

  private initDeleteBtn(): void {
    this.deleteBtn.onclick = this.onDelete;
  }

  private initQuantity(): void {
    this.quantityInput.id = this.product.lineItemId;
    this.quantityInput.onchange = this.onChange;
  }

  private init(): void {
    const img = createElement('img', {
      class: 'basket__item--img',
      src: this.product.url ? this.product.url : notImage,
      alt: "product's photo",
    });
    const name = createElement('div', { class: 'basket__item--name' });
    name.textContent = this.product.name;
    const price = createElement('div', { class: 'basket__item--price' });
    price.textContent = this.product.discountedPrice
      ? this.product.discountedPrice
      : this.product.price;
    this.totalPrice.textContent = this.product.totalPrice;
    this.priceWithPromoCode.textContent = this.product.priceWithPromoCode ?? '';
    price.append(this.priceWithPromoCode);
    this.container.append(img, name, price, this.quantityInput, this.totalPrice, this.deleteBtn);
  }

  public render(): HTMLElement {
    return this.container;
  }
}
