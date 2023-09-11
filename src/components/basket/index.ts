import { LineItem } from '@commercetools/platform-sdk';
import createElement from '../../dom-helper/create-element';
import { getCartById } from '../../services/ecommerce-api';

import './basket.scss';

export default class Basket {
  private cartId?: string | null;

  private wrapper = createElement('div', { class: 'basket__main' });

  private header = createElement('div', { class: 'basket__header' });

  private items: LineItem[] = [];

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
    this.header.append(product, quantity, price);
  }

  private init(): void {
    this.cartId = localStorage.getItem('cartId');
    if (!this.cartId) {
      this.wrapper.textContent = 'There are no items in your cart.';
    } else {
      getCartById(this.cartId).then((res) => {
        this.items = res.lineItems;
        this.wrapper.textContent = 'Items>>>>>>>>>';
      });
    }
  }

  public render(): HTMLElement {
    this.init();
    const container = createElement('div', { class: 'basket' });
    if (this.items.length > 0) {
      container.append(this.header);
    }
    container.append(this.wrapper);
    return container;
  }
}
