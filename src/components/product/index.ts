import createElement from '../../dom-helper/create-element';

import IProduct from '../../types/product';

import './product.scss';

export default class Product {
  private productElement = createElement('article', { class: 'product' });

  constructor(public product: IProduct) {
    this.product = product;
  }

  private init(): void {
    const img = createElement<HTMLImageElement>('img', {
      class: 'product__img',
      src: this.product.imageUrl,
      alt: "product's photo",
    });
    const name = createElement('div', {
      class: 'product__title',
    });
    name.textContent = this.product.name;
    const description = createElement('div', {
      class: 'product__description',
    });
    description.textContent = this.product.description;
    const price = createElement('div', {
      class: 'product__price',
    });
    price.textContent = this.product.price;
    const wrapper = createElement('div', {
      class: 'product__wrapper',
    });
    wrapper.append(name, description, price);
    this.productElement.append(img, wrapper);
  }

  public render(): HTMLElement {
    this.init();
    return this.productElement;
  }
}
