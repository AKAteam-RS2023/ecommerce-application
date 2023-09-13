import { Cart } from '@commercetools/platform-sdk';

import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import { changeQuantityProducts } from '../../services/ecommerce-api';
import { getProductsFromCart } from '../../controller/get-products-from-cart';

import BasketItem from '../basket-item';

import './basket.scss';

export default class Basket {
  private cartId?: string | null;

  private container = createElement('div', { class: 'basket' });

  private wrapper = createElement('div', { class: 'basket__main' });

  private header = createElement('div', { class: 'basket__header' });

  private items: BasketItem[] = [];

  constructor() {
    this.initHeader();
    eventEmitter.subscribe('event: change-quantity', (data) => {
      if (!this.cartId) {
        return;
      }
      if (!data || (!('lineItemId' in data) && !('quantity' in data))) {
        return;
      }
      changeQuantityProducts(this.cartId, data.lineItemId, +data.quantity).then((res) => {
        const newItemQuantity = Basket.getItemsQuantity(res, data.lineItemId);
        if (newItemQuantity) {
          eventEmitter.emit('event: change-item-quantity', {
            lineItemId: data.lineItemId,
            quantity: newItemQuantity,
          });
        }
        const newTotalItemPrice = Basket.getItemsTotalPrice(res, data.lineItemId);
        if (newTotalItemPrice) {
          eventEmitter.emit('event: change-item-total-price', {
            lineItemId: data.lineItemId,
            price: newTotalItemPrice,
          });
        }
      });
    });
  }

  private static getItemsTotalPrice = (cart: Cart, lineItemId: string): string | undefined => {
    const listItem = cart.lineItems.find((item) => item.id === lineItemId);
    if (!listItem) {
      return undefined;
    }
    return `${(listItem.totalPrice.centAmount / 100).toFixed(2)} ${listItem?.totalPrice
      .currencyCode}`;
  };

  private static getItemsQuantity = (cart: Cart, lineItemId: string): string | undefined => {
    const listItem = cart.lineItems.find((item) => item.id === lineItemId);
    if (!listItem) {
      return undefined;
    }
    return `${listItem.quantity}`;
  };

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

  private init(): void {
    this.cartId = localStorage.getItem('cartId');
    this.wrapper.innerHTML = '';
    this.items = [];
    if (!this.cartId) {
      this.wrapper.textContent = 'There are no items in your cart.';
      this.container.append(this.wrapper);
    } else {
      getProductsFromCart(this.cartId).then((res) => {
        this.items = res.map((item) => new BasketItem(item));
        if (this.items.length > 0) {
          this.items.forEach((item) => this.wrapper.append(item.render()));
          this.container.append(this.header, this.wrapper);
        }
      });
    }
  }

  public render(): HTMLElement {
    this.init();
    return this.container;
  }
}
