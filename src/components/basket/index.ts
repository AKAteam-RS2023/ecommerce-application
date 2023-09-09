import createElement from '../../dom-helper/create-element';
import { createCart } from '../../services/ecommerce-api';

import './basket.scss';

export default class Basket {
  private container = createElement('div', { class: 'basket' });

  constructor() {
    this.init();
  }

  private init(): void {
    createCart()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        this.container.textContent = err.message;
      });
  }

  public render(): HTMLElement {
    return this.container;
  }
}
