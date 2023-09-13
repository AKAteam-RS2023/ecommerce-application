import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import ICartsProduct from '../../types/carts-product';

import notImage from '../../assets/image/image-not-found.png';

import './basket-item.scss';

const MIN_VALUE = 0;

const MAX_VALUE = 100;

export default class BasketItem {
  private container = createElement('div', { class: 'basket__item' });

  private quatityValue = 1;

  private quantityInput = createElement<HTMLInputElement>('input', {
    id: 'quatity',
    type: 'number',
    value: `${this.quatityValue}`,
    min: `${MIN_VALUE}`,
    max: `${MAX_VALUE}`,
    class: 'basket__item--quantity',
  });

  constructor(
    public product: ICartsProduct,
    public lineItemId: string,
  ) {
    this.product = product;
    this.lineItemId = lineItemId;
    this.initQuantity();
    this.init();
  }

  private onChange = (): void => {
    if (+this.quantityInput.value === this.quatityValue) {
      return;
    }
    if (+this.quantityInput.value < MIN_VALUE) {
      this.quantityInput.value = `${MIN_VALUE + 1}`;
    }
    if (+this.quantityInput.value > MAX_VALUE) {
      this.quantityInput.value = `${MAX_VALUE}`;
    }
    this.quatityValue = +this.quantityInput.value;
    eventEmitter.emit('event: change-quantity', {
      quantity: `${this.quatityValue}`,
      lineItemId: this.lineItemId,
    });
  };

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
    // const quantity = createElement('div', { class: 'basket__item--quantity' });
    // quantity.textContent = `${this.product.quantity}`;
    const totalPrice = createElement('div', { class: 'basket__item--total-price' });
    totalPrice.textContent = this.product.totalPrice;
    this.container.append(img, name, price, this.quantityInput, totalPrice);
  }

  public render(): HTMLElement {
    return this.container;
  }
}
