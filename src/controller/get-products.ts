import {
  Product,
  ProductData,
  ProductProjection,
  ProductVariant,
} from '@commercetools/platform-sdk';

import IProduct from '../types/product';
import { Sort } from '../types/sort';

import { getProducts } from '../services/ecommerce-api';

const LANGUAGE = 'pl-PL';

const getName = (data: ProductData | ProductProjection): string => (data.name[LANGUAGE] ? data.name[LANGUAGE] : 'no name');

const getDescription = (data: ProductData | ProductProjection): string => (data.description && data.description[LANGUAGE] ? data.description[LANGUAGE] : 'No description');

const getUrl = (data: ProductData | ProductVariant | ProductProjection): string | undefined => {
  const newData = 'masterVariant' in data ? data.masterVariant : data;
  if (!newData.images || !Array.isArray(newData.images) || newData.images.length === 0) {
    return undefined;
  }
  return newData.images[0].url ? newData.images[0].url : undefined;
};

const getPrice = (data: ProductData | ProductVariant | ProductProjection): string => {
  const newData = 'masterVariant' in data ? data.masterVariant : data;
  if (!newData.prices || !Array.isArray(newData.prices) || newData.prices.length === 0) {
    return 'no price';
  }
  return newData.prices[0].value.centAmount && newData.prices[0].value.currencyCode
    ? `${(newData.prices[0].value.centAmount / 100).toFixed(2)} ${
      newData.prices[0].value.currencyCode
    }`
    : 'no prices';
};

const getDiscount = (
  data: ProductData | ProductVariant | ProductProjection,
): { id?: string; value?: string } | undefined => {
  const newData = 'masterVariant' in data ? data.masterVariant : data;
  if (!newData.prices || !Array.isArray(newData.prices) || newData.prices.length === 0) {
    return undefined;
  }
  if (!newData.prices[0].discounted) {
    return undefined;
  }
  const value = newData.prices[0]?.discounted?.value.centAmount;
  return value
    && newData.prices[0].discounted.discount.id
    && newData.prices[0].discounted.value.currencyCode
    ? {
      id: newData.prices[0]?.discounted?.discount.id,
      value: value
        ? `${(value / 100).toFixed(2)} ${newData.prices[0]?.discounted?.value.currencyCode}`
        : undefined,
    }
    : undefined;
};

function doProduct(product: Product | ProductProjection): IProduct[] {
  const item = 'masterData' in product ? product.masterData.current : product;
  const result: IProduct[] = [];
  result.push({
    id: product.id,
    name: getName(item),
    description: getDescription(item),
    imageUrl: getUrl(item),
    price: getPrice(item),
    discount: getDiscount(item),
  });
  if (item.variants && item.variants.length > 0) {
    item.variants.forEach((variant) => {
      result.push({
        id: product.id,
        name: getName(item),
        description: variant.key ? variant.key : 'No description',
        imageUrl: getUrl(variant),
        price: getPrice(variant),
        discount: getDiscount(variant),
        variantId: variant.id,
      });
    });
  }
  return result;
}
export default async function getIProducts(data: {
  id?: string;
  sort: Sort;
  searchQuery?: string;
}): Promise<IProduct[]> {
  const res = await getProducts(data);
  return res.map(doProduct).flat();
}
