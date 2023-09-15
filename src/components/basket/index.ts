import { Cart } from '@commercetools/platform-sdk';

import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import { changeQuantityProducts } from '../../services/ecommerce-api';
import { getProductsFromCart } from '../../controller/get-products-from-cart';

import BasketItem from '../basket-item';

import PromoCode from '../promocode/promocode';

import './basket.scss';

export default class Basket {
  private cartId?: string | null;

  private container = createElement('div', { class: 'basket' });

  private main = createElement('div', { class: 'basket__main' });

  private header = createElement('div', { class: 'basket__header' });

  private items: BasketItem[] = [];

  private errorMessage = createElement('div', { class: 'error-message' });

  private totalPrice = createElement('div', { class: 'basket__total-price--value' });

  private promoCode: PromoCode;

  constructor() {
    this.initHeader();
    this.initError();
    eventEmitter.subscribe('event: change-quantity', (data) => {
      if (!this.cartId) {
        return;
      }
      if (!data || (!('lineItemId' in data) && !('quantity' in data))) {
        return;
      }
      this.onChangeQuantity(data);
    });
    this.promoCode = new PromoCode();
    eventEmitter.subscribe('event: changePromoCode', () => {
      this.onChangePromoCode();
    });
  }

  private onChangePromoCode = (): void => {
    console.log(this.totalPrice);
  };

  private onChangeQuantity = (data: Record<string, string>): void => {
    if (!this.cartId) {
      return;
    }
    changeQuantityProducts(this.cartId, data.lineItemId, +data.quantity)
      .then((res) => {
        const newItemQuantity = Basket.getItemsQuantity(res, data.lineItemId);
        if (newItemQuantity) {
          eventEmitter.emit('event: change-item-quantity', {
            lineItemId: data.lineItemId,
            quantity: newItemQuantity,
          });
          this.totalPrice.textContent = Basket.getTotalPrice(res);
        }
        const newTotalItemPrice = Basket.getItemsTotalPrice(res, data.lineItemId);
        if (newTotalItemPrice) {
          eventEmitter.emit('event: change-item-total-price', {
            lineItemId: data.lineItemId,
            price: newTotalItemPrice,
          });
        }
      })
      .catch(() => {
        this.showError();
        this.init();
      });
  };

  private initError(): void {
    this.errorMessage.textContent = 'Something went wrong. Try again';
    document.body.append(this.errorMessage);
  }

  private showError(): void {
    this.errorMessage.classList.add('show');
    setTimeout(() => {
      this.errorMessage.classList.remove('show');
    }, 2000);
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

  private static getTotalPrice = (cart: Cart): string => `${(cart.totalPrice.centAmount / 100).toFixed(2)} ${cart.totalPrice.currencyCode}`;

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

  private renderTotalPrice(price: string): HTMLElement {
    const title = createElement('div', { class: 'basket__total-price--title' });
    title.textContent = 'Cart Totals:';
    this.totalPrice.textContent = price;
    const wrapper = createElement('div', { class: 'basket__total-price' });
    wrapper.append(title, this.totalPrice);
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
      return;
    }
    getProductsFromCart(this.cartId)
      .then((res) => {
        this.items = res.products.map((item) => new BasketItem(item));
        if (this.items.length > 0) {
          this.items.forEach((item) => this.main.append(item.render()));
          const wrapper = createElement('div', { class: 'basket__wrapper' });
          wrapper.append(this.header, this.main);
          this.container.append(
            wrapper,
            this.renderTotalPrice(res.totalPrice),
            this.promoCode.render(),
          );
        }
      })
      .catch(() => {
        this.main.textContent = 'There are no items in your cart.';
        this.container.append(this.main);
      });
  }

  public render(): HTMLElement {
    this.init();
    return this.container;
  }
}
