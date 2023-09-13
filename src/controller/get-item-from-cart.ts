import { LineItem } from '@commercetools/platform-sdk';

import { getCartById } from '../services/ecommerce-api';

export const getItemFromCart = async (
  cartId: string,
  productId: string,
  variantId: number,
): Promise<LineItem | undefined> => {
  const res = await getCartById(cartId);
  let lineItem: LineItem | undefined;

  const lineItems = res.lineItems.filter((item) => item.productId === productId);
  if (lineItems.length === 0) {
    return undefined;
  }
  if (lineItems.some((item) => item.variant.id === variantId)) {
    lineItem = lineItems.find((item) => item.variant.id === variantId);
  }
  if (Number.isNaN(variantId) && lineItems.some((item) => item.variant.id === 1)) {
    lineItem = lineItems.find((item) => item.variant.id === 1);
  }
  return lineItem;
};
