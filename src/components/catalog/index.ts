import createElement from '../../dom-helper/create-element';
import Product from '../product';
import './catalog.scss';

import chair from '../../assets/image/Images.png';

export default class Catalog {
  private container = createElement('div', { class: 'catalog' });

  private init(): void {
    const product = new Product(chair, 'Leviosa', 'Stylish cafe chair', 2500);
    this.container.append(product.render());
  }

  public render(): HTMLElement {
    this.init();
    return this.container;
  }
}
