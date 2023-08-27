import { ProductData, ProductVariant } from '@commercetools/platform-sdk';
import { getProducts } from '../services/ecommerce-api';
import IProduct from '../types/product';

const getName = (data: ProductData): string => (data.metaTitle ? data.metaTitle['en-US'] : 'No name');

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
    return data.masterVariant.prices && data.masterVariant.prices[0]?.discounted
      ? {
        id: data.masterVariant.prices[0]?.discounted.discount.id,
        value: `${data.masterVariant.prices[0]?.discounted?.value.centAmount} ${data.masterVariant.prices[0]?.discounted?.value.currencyCode}`,
      }
      : undefined;
  }
  return data.prices && data.prices[0]?.discounted
    ? {
      id: data.prices[0]?.discounted?.discount.id,
      value: `${data.prices[0]?.discounted?.value.centAmount} ${data.prices[0]?.discounted?.value.currencyCode}`,
    }
    : undefined;
};

export default async function getAllProducts(): Promise<IProduct[]> {
  const res = await getProducts();
  const result: IProduct[] = [];
  res.forEach((item) => {
    result.push({
      id: item.id,
      name: getName(item.masterData.current),
      description: getDescription(item.masterData.current),
      imageUrl: getUrl(item.masterData.current),
      price: getPrice(item.masterData.current),
      discount: getDiscount(item.masterData.current),
    });
    if (item.masterData.current.variants.length > 0) {
      item.masterData.current.variants.forEach((variant) => {
        result.push({
          id: item.id,
          name: getName(item.masterData.current),
          description: variant.key ? variant.key : 'No description',
          imageUrl: getUrl(variant),
          price: getPrice(variant),
          discount: getDiscount(variant),
        });
      });
    }
  });
  return result;
}
