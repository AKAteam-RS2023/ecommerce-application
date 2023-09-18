import { Cart } from '@commercetools/platform-sdk';

import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import {
  changeQuantityProducts,
  matchDiscountCode,
  removeDiscountCode,
  deleteCart,
  removeProduct,
} from '../../services/ecommerce-api';
import { getProductsFromCart } from '../../controller/get-products-from-cart';

import BasketItem from '../basket-item';
import errorMessage from '../basket-error';

import PromoCode from '../promocode/promocode';

import './basket.scss';
import ModalBox from '../modal-box/modal-box';
import ConfirmClear from './confirm-clear';

export default class Basket {
  private cartId?: string | null;

  private container = createElement('div', { class: 'basket' });

  private main = createElement('div', { class: 'basket__main' });

  private header = createElement('div', { class: 'basket__header' });

  private items: BasketItem[] = [];

  private totalPrice = createElement('div', { class: 'basket__total-price--value' });

  private promoCode: PromoCode;

  private confirmClear: ConfirmClear = new ConfirmClear(
    () => this.clearCart(),
    () => this.modalBox.hide(),
  );

  private modalBox = new ModalBox(this.confirmClear, 'extra-small');

  constructor() {
    this.initHeader();
    eventEmitter.subscribe('event: change-quantity', (data) => {
      if (!this.cartId) {
        return;
      }
      if (!data || (!('lineItemId' in data) && !('quantity' in data))) {
        return;
      }
      this.onChangeQuantity(data);
    });
    this.promoCode = PromoCode.instance || new PromoCode();
    eventEmitter.subscribe('event: changePromoCode', (data) => {
      this.onApplyPromoCode(data);
    });
    eventEmitter.subscribe('event: removePromoCode', (data) => {
      this.onRemovePromoCode(data);
    });

    eventEmitter.subscribe('event: remove-item-from-cart', (data) => {
      if (!this.cartId) {
        return;
      }
      if (!data || (!('lineItemId' in data) && !('quantity' in data))) {
        return;
      }
      removeProduct(this.cartId, data.lineItemId, +data.quantity).then((res) => {
        eventEmitter.emit('event: remove-item', { lineItemId: data.lineItemId });
        this.totalPrice.textContent = Basket.getTotalPrice(res);
        this.items = this.items.filter((item) => item.product.lineItemId !== data.lineItemId);
        this.checkItems();
      });
    });
  }

  private clearCart = (): void => {
    if (this.cartId) {
      deleteCart(this.cartId)
        .then(() => {
          this.modalBox.hide();
          this.init();
        })
        .catch(() => {
          this.modalBox.hide();
          errorMessage.showError();
          this.init();
        });
    }
  };

  private checkItems(): void {
    if (this.items.length === 0) {
      this.container.innerHTML = '';
      this.main.innerHTML = '';
      this.main.textContent = 'There are no items in your cart.';
      this.container.append(this.main);
    }
  }

  private onApplyPromoCode = (data: Record<string, string> | undefined): void => {
    if (!this.cartId) return;
    if (data?.code) {
      matchDiscountCode(this.cartId, data.code)
        .then((res) => {
          console.log('res', res);
          this.promoCode.appliedCode = [];
          res.discountCodes.forEach((itemDiscount) => {
            this.promoCode.discountCodeMatch(itemDiscount, data.code);
            this.promoCode.appliedCode?.push({ code: undefined, discountCodeInfo: itemDiscount });
          });
          this.promoCode.renderAllDiscountCode();
          if (res.lineItems.length > 0) {
            res.lineItems.forEach((item) => {
              const newTotalItemPrice = Basket.getItemsTotalPrice(res, item.id);
              const newItemPriceWithCode = PromoCode.getItemsDiscountedPrice(res, item.id);
              if (newItemPriceWithCode) {
                eventEmitter.emit('event: change-item-discount-price', {
                  lineItemId: item.id,
                  price: newItemPriceWithCode,
                });
              }
              if (newTotalItemPrice) {
                eventEmitter.emit('event: change-item-total-price', {
                  lineItemId: item.id,
                  price: newTotalItemPrice,
                });
              }
            });
          }
          this.totalPrice.textContent = Basket.getTotalPrice(res);
        })
        .catch((e) => {
          this.promoCode.infoPromoCodeField.textContent = `${e.message}`;
          this.promoCode.infoPromoCodeField.classList.remove('success');
          this.promoCode.infoPromoCodeField.classList.add('error');
        });
    }
  };

  private onRemovePromoCode = (data: Record<string, string> | undefined): void => {
    if (!this.cartId) {
      return;
    }
    if (data?.typeId && data.id) {
      removeDiscountCode(this.cartId, { typeId: data.typeId as 'discount-code', id: data.id })
        .then((res) => {
          if (res.lineItems.length > 0) {
            this.init();
          }
          this.totalPrice.textContent = Basket.getTotalPrice(res);
          this.promoCode.infoPromoCodeField.textContent = 'The promocode was successfully removed!';
          this.promoCode.infoPromoCodeField.classList.add('success');
          this.promoCode.infoPromoCodeField.classList.remove('error');
        })
        .catch((e) => {
          console.log('2', e.message);
          this.promoCode.infoPromoCodeField.textContent = e.message;
          this.promoCode.infoPromoCodeField.classList.remove('success');
          this.promoCode.infoPromoCodeField.classList.add('error');
        });
    }
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
        errorMessage.showError();
        this.init();
      });
  };

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
    this.promoCode.infoPromoCodeField.textContent = '';
    if (!this.cartId) {
      this.checkItems();
      return;
    }
    getProductsFromCart(this.cartId)
      .then((res) => {
        this.promoCode.appliedCode = [];
        res.discountCodes.forEach((itemPromoCode) => {
          this.promoCode?.appliedCode?.push({ code: undefined, discountCodeInfo: itemPromoCode });
        });
        this.items = res.products.map((item) => new BasketItem(item));
        if (this.items.length > 0) {
          this.items.forEach((item) => this.main.append(item.render()));
          this.main.append(this.renderClearCart());
          const wrapper = createElement('div', { class: 'basket__wrapper' });
          wrapper.append(this.header, this.main);
          this.container.append(
            wrapper,
            this.renderTotalPrice(res.totalPrice),
            this.promoCode.render(),
          );
          return;
        }
        this.checkItems();
      })
      .catch(() => {
        this.checkItems();
      });
  }

  public render(): HTMLElement {
    this.init();
    return this.container;
  }

  private renderClearCart(): HTMLElement {
    const clearCart = createElement('div', { class: 'basket__clear' });
    const clearCartBtn = createElement('div', { class: 'basket__clear--button' });
    clearCartBtn.textContent = 'Clear cart';
    clearCart.append(clearCartBtn);
    clearCartBtn.addEventListener('click', () => this.modalBox.show());
    return clearCart;
  }
}
