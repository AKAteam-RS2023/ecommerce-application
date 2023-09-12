import createElement from '../../dom-helper/create-element';

import { getProductsFromCart } from '../../controller/get-products-from-cart';

import BasketItem from '../basket-item';

import './basket.scss';

export default class Basket {
  private cartId?: string | null;

  private container = createElement('div', { class: 'basket' });

  private wrapper = createElement('div', { class: 'basket__main' });

  private header = createElement('div', { class: 'basket__header' });

  private items: BasketItem[] = [];

  constructor() {
    this.initHeader();
  }

  private initHeader(): void {
    const product = createElement('div', { class: 'basket__header--name' });
    product.textContent = 'Product';
    const quantity = createElement('div', { class: 'basket__header--quantity' });
    quantity.textContent = 'Quantity';
    const price = createElement('div', { class: 'basket__header--price' });
    price.textContent = 'Price';
    const totalPrice = createElement('div', { class: 'basket__header--price' });
    totalPrice.textContent = 'Total Price';
    this.header.append(product, price, quantity, totalPrice);
  }

  private init(): void {
    this.cartId = localStorage.getItem('cartId');
    this.wrapper.innerHTML = '';
    this.items = [];
    if (!this.cartId) {
      this.wrapper.textContent = 'There are no items in your cart.';
      this.container.append(this.wrapper);
    } else {
      getProductsFromCart(this.cartId).then((res) => {
        this.items = res.map((item) => new BasketItem(item));
        if (this.items.length > 0) {
          this.items.forEach((item) => this.wrapper.append(item.render()));
          this.container.append(this.header, this.wrapper);
        }
      });
    }
  }

  public render(): HTMLElement {
    this.init();
    return this.container;
  }
}
