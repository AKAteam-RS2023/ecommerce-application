import { LineItem } from '@commercetools/platform-sdk';
import { getCartById } from '../services/ecommerce-api';
import ICartsProduct from '../types/carts-product';

const LANGUAGE = 'pl-PL';

const getName = (data: LineItem): string => (data.name[LANGUAGE] ? data.name[LANGUAGE] : 'no name');

const getQuantity = (data: LineItem): number => data.quantity;

const getTotalPrice = (data: LineItem): string => `${(data.totalPrice.centAmount / 100).toFixed(2)} ${data.totalPrice.currencyCode}`;

const getUrl = (data: LineItem): string | undefined => {
  if (
    !data.variant.images
    || !Array.isArray(data.variant.images)
    || data.variant.images.length === 0
  ) {
    return undefined;
  }
  return data.variant.images[0].url ? data.variant.images[0].url : undefined;
};

const getPrice = (data: LineItem): string => {
  if (
    !data.variant.prices
    || !Array.isArray(data.variant.prices)
    || data.variant.prices.length === 0
  ) {
    return 'no price';
  }
  return data.variant.prices[0].value.centAmount && data.variant.prices[0].value.currencyCode
    ? `${(data.variant.prices[0].value.centAmount / 100).toFixed(2)} ${
      data.variant.prices[0].value.currencyCode
    }`
    : 'no prices';
};

const getDiscountedPrice = (data: LineItem): string | undefined => {
  if (
    !data.variant.prices
    || !Array.isArray(data.variant.prices)
    || data.variant.prices.length === 0
  ) {
    return undefined;
  }
  if (!data.variant.prices[0].discounted) {
    return undefined;
  }
  return data.variant.prices[0].discounted.value.centAmount
    && data.variant.prices[0].discounted.value.currencyCode
    ? `${(data.variant.prices[0].discounted.value.centAmount / 100).toFixed(2)} ${
      data.variant.prices[0].discounted.value.currencyCode
    }`
    : undefined;
};

export const getProductsFromCart = async (cartId: string): Promise<ICartsProduct[]> => {
  const result: ICartsProduct[] = [];
  const res = await getCartById(cartId);
  res.lineItems.forEach((item) => {
    result.push({
      name: getName(item),
      url: getUrl(item),
      price: getPrice(item),
      discountedPrice: getDiscountedPrice(item),
      totalPrice: getTotalPrice(item),
      quantity: getQuantity(item),
      lineItemId: item.id,
    });
  });
  return result;
};
