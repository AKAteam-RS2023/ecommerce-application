import createElement from '../../dom-helper/create-element';
import { getCartById } from '../../services/ecommerce-api';

import './basket.scss';

export default class Basket {
  private cartId?: string | null;

  private container = createElement('div', { class: 'basket' });

  private init(): void {
    this.cartId = localStorage.getItem('cartId');
    if (!this.cartId || this.cartId === null) {
      this.container.textContent = 'Ooops';
    } else {
      getCartById(this.cartId).then((res) => {
        console.log(res);
        this.container.textContent = res.cartState;
      });
    }
  }

  public render(): HTMLElement {
    this.init();
    return this.container;
  }
}
