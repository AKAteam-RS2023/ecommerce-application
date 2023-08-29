import { Product, ProductData, ProductVariant } from '@commercetools/platform-sdk';
import { getProducts } from '../services/ecommerce-api';
import IProduct from '../types/product';

const getName = (data: ProductData): string => data.name['en-US'];

const getDescription = (data: ProductData): string => (data.description ? data.description['en-US'] : 'No description');

const getUrl = (data: ProductData | ProductVariant): string => {
  if ('masterVariant' in data) {
    return data.masterVariant.images
      ? data.masterVariant.images[0].url
      : '../assets/image/image-not-found.png';
  }
  return data.images ? data.images[0].url : '../assets/image/image-not-found.png';
};

const getPrice = (data: ProductData | ProductVariant): string => {
  if ('masterVariant' in data) {
    return data.masterVariant.prices
      ? `${data.masterVariant.prices[0].value.centAmount / 100} ${
        data.masterVariant.prices[0].value.currencyCode
      }`
      : 'No price';
  }
  return data.prices
    ? `${data.prices[0].value.centAmount / 100} ${data.prices[0].value.currencyCode}`
    : 'no prices';
};

const getDiscount = (
  data: ProductData | ProductVariant,
): { id?: string; value?: string } | undefined => {
  if ('masterVariant' in data) {
    if (!data.masterVariant.prices) {
      return undefined;
    }
    const value = data.masterVariant.prices[0]?.discounted?.value.centAmount;
    return data.masterVariant.prices
      && data.masterVariant.prices[0]?.discounted
      && !Number.isNaN(data.masterVariant.prices[0]?.discounted?.value.centAmount)
      ? {
        id: data.masterVariant.prices[0]?.discounted.discount.id,
        value: value
          ? `${value / 100} ${data.masterVariant.prices[0]?.discounted?.value.currencyCode}`
          : undefined,
      }
      : undefined;
  }
  if (!data.prices) {
    return undefined;
  }
  const value = data.prices[0]?.discounted?.value.centAmount;
  return data.prices && data.prices[0]?.discounted
    ? {
      id: data.prices[0]?.discounted?.discount.id,
      value: value
        ? `${value / 100} ${data.prices[0]?.discounted?.value.currencyCode}`
        : undefined,
    }
    : undefined;
};

export function doProduct(product: Product): IProduct {
  return {
    id: product.id,
    name: getName(product.masterData.current),
    description: getDescription(product.masterData.current),
    imageUrl: getUrl(product.masterData.current),
    price: getPrice(product.masterData.current),
    discount: getDiscount(product.masterData.current),
  };
}

export default async function getAllProducts(): Promise<IProduct[]> {
  const res = await getProducts();
  const result: IProduct[] = [];
  res.forEach((item) => {
    result.push(doProduct(item));
    if (item.masterData.current.variants.length > 0) {
      item.masterData.current.variants.forEach((variant) => {
        result.push({
          id: item.id,
          name: getName(item.masterData.current),
          description: variant.key ? variant.key : 'No description',
          imageUrl: getUrl(variant),
          price: getPrice(variant),
          discount: getDiscount(variant),
          variantId: variant.id,
        });
      });
    }
  });
  return result;
}
