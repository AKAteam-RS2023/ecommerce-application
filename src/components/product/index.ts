import createElement from '../../dom-helper/create-element';
import './product.scss';

export default class Product {
  private product = createElement('article', { class: 'product' });

  constructor(
    public imageSrc: string,
    public name: string,
    public description: string,
    public price: number,
  ) {
    this.imageSrc = imageSrc;
    this.name = name;
    this.description = description;
    this.price = price;
  }

  private init(): void {
    const img = createElement<HTMLImageElement>('img', {
      class: 'product__img',
      src: this.imageSrc,
      alt: "product's photo",
    });
    const name = createElement('div', {
      class: 'product__title',
    });
    name.textContent = this.name;
    const description = createElement('div', {
      class: 'product__description',
    });
    description.textContent = this.description;
    const price = createElement('div', {
      class: 'product__price',
    });
    price.textContent = `${this.price}`;
    const wrapper = createElement('div', {
      class: 'product__wrapper',
    });
    wrapper.append(name, description, price);
    this.product.append(img, wrapper);
  }

  public render(): HTMLElement {
    this.init();
    return this.product;
  }
}
