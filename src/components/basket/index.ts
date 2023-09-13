import createElement from '../../dom-helper/create-element';

import { getProductsFromCart } from '../../controller/get-products-from-cart';

import BasketItem from '../basket-item';

import './basket.scss';

export default class Basket {
  private cartId?: string | null;

  private container = createElement('div', { class: 'basket' });

  private main = createElement('div', { class: 'basket__main' });

  private header = createElement('div', { class: 'basket__header' });

  private items: BasketItem[] = [];

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
    const totalPrice = createElement('div', { class: 'basket__header--price' });
    totalPrice.textContent = 'Total Price';
    this.header.append(product, price, quantity, totalPrice);
  }

  private static renderTotalPrice(price: string): HTMLElement {
    const title = createElement('div', { class: 'basket__total-price--title' });
    title.textContent = 'Cart Totals:';
    const priceValue = createElement('div', { class: 'basket__total-price--value' });
    priceValue.textContent = price;
    const wrapper = createElement('div', { class: 'basket__total-price' });
    wrapper.append(title, priceValue);
    return wrapper;
  }

  private init(): void {
    this.cartId = localStorage.getItem('cartId');
    this.container.innerHTML = '';
    this.main.innerHTML = '';
    this.items = [];
    if (!this.cartId) {
      this.main.textContent = 'There are no items in your cart.';
      this.container.append(this.main);
    } else {
      getProductsFromCart(this.cartId).then((res) => {
        this.items = res.products.map((item) => new BasketItem(item));
        if (this.items.length > 0) {
          this.items.forEach((item) => this.main.append(item.render()));
          const wrapper = createElement('div', { class: 'basket__wrapper' });
          wrapper.append(this.header, this.main);
          this.container.append(wrapper, Basket.renderTotalPrice(res.totalPrice));
        }
      });
    }
  }

  public render(): HTMLElement {
    this.init();
    return this.container;
  }
}
