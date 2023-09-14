import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import ICartsProduct from '../../types/carts-product';

import notImage from '../../assets/image/image-not-found.png';
import deleteItem from '../../assets/image/delete.png';

import './basket-item.scss';

const MIN_VALUE = 1;

const MAX_VALUE = 100;

export default class BasketItem {
  private container = createElement('div', { class: 'basket__item' });

  private quantityInput = createElement<HTMLInputElement>('input', {
    id: 'quatity',
    type: 'number',
    value: `${this.product.quantity}`,
    min: `${MIN_VALUE}`,
    max: `${MAX_VALUE}`,
    class: 'basket__item--quantity',
  });

  private totalPrice = createElement('div', { class: 'basket__item--total-price' });

  private deleteBtn = createElement<HTMLInputElement>('input', {
    class: 'basket__item--delete',
    type: 'image',
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
  }

  private onChange = (): void => {
    if (+this.quantityInput.value === this.product.quantity) {
      return;
    }
    if (+this.quantityInput.value < MIN_VALUE) {
      this.quantityInput.value = `${MIN_VALUE}`;
    }
    if (+this.quantityInput.value > MAX_VALUE) {
      this.quantityInput.value = `${MAX_VALUE}`;
    }
    eventEmitter.emit('event: change-quantity', {
      quantity: this.quantityInput.value,
      lineItemId: this.product.lineItemId,
    });
  };

  private onDelete = (): void => {
    console.log(this.deleteBtn);
  };

  private initDeleteBtn(): void {
    this.deleteBtn.onclick = this.onDelete;
  }

  private initQuantity(): void {
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
    // const totalPrice = createElement('div', { class: 'basket__item--total-price' });
    this.totalPrice.textContent = this.product.totalPrice;
    this.container.append(img, name, price, this.quantityInput, this.totalPrice, this.deleteBtn);
  }

  public render(): HTMLElement {
    return this.container;
  }
}
