import createElement from '../../dom-helper/create-element';

import ICartsProduct from '../../types/carts-product';

import notImage from '../../assets/image/image-not-found.png';

import './basket-item.scss';

export default class BasketItem {
  private container = createElement('div', { class: 'basket__item' });

  constructor(public product: ICartsProduct) {
    this.product = product;
    this.init();
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
    price.textContent = this.product.price;
    const quantity = createElement('div', { class: 'basket__item--quantity' });
    quantity.textContent = `${this.product.quantity}`;
    const totalPrice = createElement('div', { class: 'basket__item--total-price' });
    totalPrice.textContent = this.product.totalPrice;
    this.container.append(img, name, price, quantity, totalPrice);
  }

  public render(): HTMLElement {
    return this.container;
  }
}
