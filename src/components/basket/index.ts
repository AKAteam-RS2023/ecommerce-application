import createElement from '../../dom-helper/create-element';
import { createCart } from '../../services/ecommerce-api';

import './basket.scss';

export default class Basket {
  private cartId?: string | null;

  private container = createElement('div', { class: 'basket' });

  private init(): void {
    this.cartId = localStorage.getItem('cartId');
    if (!this.cartId || this.cartId === null) {
      createCart()
        .then(() => {
          this.cartId = localStorage.getItem('cartId');
          this.container.textContent = `created cart ${this.cartId}`;
        })
        .catch((err) => {
          this.container.textContent = err.message;
        });
    } else {
      this.container.textContent = `created cart ${this.cartId}`;
    }
  }

  public render(): HTMLElement {
    this.init();
    return this.container;
  }
}
