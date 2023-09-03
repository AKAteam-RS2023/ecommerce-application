import {
  Product,
  ProductData,
  ProductProjection,
  ProductVariant,
} from '@commercetools/platform-sdk';

import IProduct from '../types/product';
import Sort from '../types/sort';

import { getProducts } from '../services/ecommerce-api';
import IFilters from '../types/filters';

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

const getProductAttributes = (
  data: ProductData | ProductVariant | ProductProjection,
): Record<string, string[]> | undefined => {
  const newData = 'masterVariant' in data ? data.masterVariant : data;
  const result: Record<string, string[]> = {};
  if (
    !newData.attributes
    || !Array.isArray(newData.attributes)
    || newData.attributes.length === 0
  ) {
    return undefined;
  }
  newData.attributes.forEach((item) => {
    if (Array.isArray(item.value)) {
      result[item.name] = [...item.value.map((attr) => attr.key)];
      return;
    }
    result[item.name] = [];
    result[item.name].push(item.value.key);
  });
  return result;
};

const checkSetAttributes = (
  set: Set<unknown> | undefined,
  productAttr: Record<string, string[]> | undefined,
  attr: string,
): boolean => {
  if (!set || set.size === 0) {
    return true;
  }
  if (!productAttr || !(attr in productAttr) || productAttr[attr].length === 0) {
    return false;
  }
  return productAttr[attr].some((item) => set.has(item));
};

const checkAttributes = (
  product: ProductData | ProductProjection | ProductVariant,
  filters?: IFilters,
): boolean => !filters
  || (checkSetAttributes(filters.colors, getProductAttributes(product), 'color')
    && checkSetAttributes(filters.madein, getProductAttributes(product), 'made-in')
    && +getPrice(product).replace(/\D/g, '') / 100 >= filters.startPrice
    && +getPrice(product).replace(/\D/g, '') / 100 <= filters.finishPrice);

function doProduct(product: Product | ProductProjection, filters?: IFilters): IProduct[] {
  const item = 'masterData' in product ? product.masterData.current : product;
  const result: IProduct[] = [];
  if (checkAttributes(item, filters)) {
    result.push({
      id: product.id,
      name: getName(item),
      description: getDescription(item),
      imageUrl: getUrl(item),
      price: getPrice(item),
      discount: getDiscount(item),
    });
  }
  if (item.variants && item.variants.length > 0) {
    item.variants.forEach((variant) => {
      if (checkAttributes(variant, filters)) {
        result.push({
          id: product.id,
          name: getName(item),
          description: variant.key ? variant.key : 'No description',
          imageUrl: getUrl(variant),
          price: getPrice(variant),
          discount: getDiscount(variant),
          variantId: variant.id,
        });
      }
    });
  }
  return result;
}
export default async function getIProducts(data: {
  categoryId?: string;
  sort: Sort;
  filters?: IFilters;
}): Promise<IProduct[]> {
  const res = await getProducts(data);
  return res.map((item) => doProduct(item, data.filters)).flat();
}
