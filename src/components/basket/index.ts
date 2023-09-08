import createElement from '../../dom-helper/create-element';

import './basket.scss';

export default class Basket {
  private container = createElement('div', { class: 'basket' });

  constructor() {
    this.init();
  }

  private init(): void {
    this.container.textContent = 'Basket';
  }

  public render(): HTMLElement {
    return this.container;
  }
}
