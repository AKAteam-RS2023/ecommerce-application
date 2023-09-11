import createElement from '../../dom-helper/create-element';

import './basket-item.scss';

export default class BasketItem {
  private container = createElement('div', { class: 'basket__item' });

  constructor(
    public product: {
      imgUrl?: string;
      name: string;
      price: string;
      quantity: number;
      totalPrice: string;
    },
  ) {
    this.product = product;
    this.init();
  }

  private init(): void {
    this.container.textContent = 'Items>>>';
  }

  public render(): HTMLElement {
    return this.container;
  }
}
