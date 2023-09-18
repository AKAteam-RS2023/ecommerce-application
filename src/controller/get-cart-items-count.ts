import { calculateTotalItems } from '../dom-helper/cart-calculation';
import eventEmitter from '../dom-helper/event-emitter';
import { getCartById } from '../services/ecommerce-api';

export const getCartItemsCount = (): void => {
  const cartId = localStorage.getItem('cartId') ?? '';
  if (cartId) {
    getCartById(cartId)
      .then((res) => eventEmitter.emit('event: update-items-count', { count: calculateTotalItems(res) }))
      .catch(() => eventEmitter.emit('event: update-items-count', { count: '0' }));
  } else {
    eventEmitter.emit('event: update-items-count', { count: '0' });
  }
};
