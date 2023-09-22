import { Cart } from '@commercetools/platform-sdk';

export const calculateTotalItems = (cart: Cart): string => {
  const items = cart.lineItems ?? [];
  return items
    .map((item) => item.quantity)
    .reduce((sum, quantity) => sum + quantity, 0)
    .toString();
};
