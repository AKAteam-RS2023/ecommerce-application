import { Product, ProductData, ProductVariant } from '@commercetools/platform-sdk';
import { getProductById } from '../services/ecommerce-api';
import IProductDetails from '../types/interfaces/productDetails';

const getName = (data: ProductData): string => (data.name['pl-PL'] ? data.name['pl-PL'] : 'Bez nazwy');

const getDescription = (data: ProductData): string => {
  if (data.description) {
    return data.description['pl-PL'] ? data.description['pl-PL'] : 'Bez opisu';
  }
  return 'Bez opisu';
};

const getPictures = (data: ProductData | ProductVariant): string[] | undefined => {
  const ArrayOfImages: string[] = [];
  if ('masterVariant' in data) {
    if (data.masterVariant.images) {
      data.masterVariant.images.forEach((item) => {
        ArrayOfImages.push(item.url);
      });
    } else ArrayOfImages.push('../assets/image/image-not-found.png');
  } else if (data.images) {
    data.images.forEach((item) => {
      ArrayOfImages.push(item.url);
    });
  } else ArrayOfImages.push('../assets/image/image-not-found.png');
  return ArrayOfImages;
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

export default async function getProductDetails(productId: string): Promise<IProductDetails> {
  const res: Product = await getProductById(productId);
  return {
    id: res.id,
    name: getName(res.masterData.current),
    description: getDescription(res.masterData.current),
    imagesUrl: getPictures(res.masterData.current),
    price: getPrice(res.masterData.current),
    discount: getDiscount(res.masterData.current),
  };
}
