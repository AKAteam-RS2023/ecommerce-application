import createElement from '../../dom-helper/create-element';
import { getProductDiscontById } from '../../services/ecommerce-api';

import IProduct from '../../types/product';

import Router from '../router/router';

import './product-card.scss';

export default class ProductCard {
  private productElement = createElement('article', { class: 'product' });

  private oldPrice: HTMLElement | null = null;

  public currencyCode = 'PLN';

  private router = Router.instance;

  constructor(public product: IProduct) {
    this.product = product;
    this.initOldPrice();
    this.initDiscount();
    this.productElement.onclick = (): void => {
      this.router?.navigate(
        `catalog/product?productID=${this.product.id}${this.product.variantId ? `&variantID=${this.product.variantId}` : ''}`,
      );
    };
  }

  private initOldPrice(): void {
    if (!this.product.discount || !this.product.discount.value) {
      return;
    }
    this.oldPrice = createElement('div', { class: 'product__old-price' });
    this.oldPrice.textContent = this.product.discount.value;
  }

  private initDiscount(): void {
    if (!this.product.discount || !this.product.discount.id) {
      return;
    }
    const discount = createElement('div', { class: 'product__discount' });
    getProductDiscontById(this.product.discount?.id).then((res) => {
      const { type } = res.value;
      switch (type) {
        case 'relative': {
          discount.textContent = `${res.value.permyriad / 100}%`;
          break;
        }
        case 'absolute': {
          discount.textContent = `${
            res.value.money.filter((item) => item.currencyCode === this.currencyCode)[0]
              .centAmount / 100
          } ${this.currencyCode}`;
          break;
        }
        default:
      }
    });
    this.productElement.append(discount);
  }

  private init(): void {
    const img = createElement<HTMLImageElement>('img', {
      class: 'product__img',
      src: this.product.imageUrl,
      alt: this.product.description,
    });
    const name = createElement('div', {
      class: 'product__title',
    });
    name.textContent = this.product.name;
    const description = createElement('div', {
      class: 'product__description',
    });
    description.textContent = this.product.description;
    description.title = this.product.description;
    const price = createElement('div', {
      class: 'product__price',
    });
    price.textContent = this.product.price;
    const wrapperPrices = createElement('div', { class: 'product__wrapper-prices' });
    wrapperPrices.append(price);
    this.initOldPrice();
    if (this.oldPrice) {
      wrapperPrices.append(this.oldPrice);
    }
    const wrapper = createElement('div', {
      class: 'product__wrapper',
    });
    wrapper.append(name, description, wrapperPrices);
    this.productElement.append(img, wrapper);
  }

  public render(): HTMLElement {
    this.init();
    return this.productElement;
  }
}
