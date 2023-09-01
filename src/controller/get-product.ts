import {
  Attribute, Product, ProductData, ProductVariant,
} from '@commercetools/platform-sdk';
import { getProductById } from '../services/ecommerce-api';
import IProductDetails from '../types/interfaces/productDetails';
import notFoundImg from '../assets/image/image-not-found.png';

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
    if (data.masterVariant.images && data.masterVariant.images.length > 0) {
      data.masterVariant.images.forEach((item) => {
        ArrayOfImages.push(item.url);
      });
    } else ArrayOfImages.push(notFoundImg);
  } else if (data.images && data.images.length > 0) {
    data.images.forEach((item) => {
      ArrayOfImages.push(item.url);
    });
  } else ArrayOfImages.push(notFoundImg);
  return ArrayOfImages;
};

const getPrice = (data: ProductData | ProductVariant): string => {
  if ('masterVariant' in data) {
    if (data.masterVariant.prices
      && data.masterVariant.prices[0]?.value.centAmount
      && data.masterVariant.prices[0]?.value.currencyCode) {
      return `${(data.masterVariant.prices[0].value.centAmount / 100).toFixed(2)} ${
        data.masterVariant.prices[0].value.currencyCode
      }`;
    }
    return 'brak danych';
  }
  if (data.prices && data.prices[0]?.value.centAmount && data.prices[0]?.value.currencyCode) {
    return `${(data.prices[0].value.centAmount / 100).toFixed(2)} ${data.prices[0].value.currencyCode}`;
  }
  return 'brak danych';
};

const getAttributes = (data: ProductData | ProductVariant): Attribute[] | undefined => {
  const attributes: Attribute[] = [];
  if ('masterVariant' in data) {
    if (data.masterVariant.attributes && data.masterVariant.attributes.length > 0) {
      data.masterVariant.attributes.forEach((item) => {
        attributes.push(item);
      });
    }
  } else if (data.attributes && data.attributes.length > 0) {
    data.attributes.forEach((item) => {
      attributes.push(item);
    });
  }
  return attributes.length > 0 ? attributes : undefined;
};

const getDiscount = (
  data: ProductData | ProductVariant,
): { id?: string; value?: string } | undefined => {
  if ('masterVariant' in data) {
    const path = data.masterVariant.prices?.[0]?.discounted;
    if (path) {
      if (
        path.discount
        && path.discount.id
        && path.value.centAmount
        && path.value?.currencyCode) {
        return {
          id: path.discount.id,
          value: `${(path.value.centAmount / 100).toFixed(2)} ${path.value.currencyCode}`,
        };
      }
      return undefined;
    }
  } else {
    const path = data.prices?.[0]?.discounted;
    if (data.prices
      && path?.discount
      && path.discount.id
      && path.value
      && path.value.centAmount
      && path.value.currencyCode) {
      return {
        id: path.discount.id,
        value: `${(path.value.centAmount / 100).toFixed(2)} ${path.value.currencyCode}`,
      };
    }
    return undefined;
  }
  return undefined;
};

export default async function getProductDetails(
  productId: string,
  productVariantId?: number,
): Promise<IProductDetails> {
  const res: Product = await getProductById(productId);
  if (productVariantId) {
    const productVariant = res.masterData.current.variants.find(
      (variant) => variant.id === productVariantId,
    );
    if (productVariant) {
      return {
        id: res.id,
        name: getName(res.masterData.current),
        description: getDescription(res.masterData.current),
        imagesUrl: getPictures(productVariant),
        price: getPrice(productVariant),
        discount: getDiscount(productVariant),
        attributes: getAttributes(productVariant),
        variantId: productVariant.id,
      };
    }
  }
  return {
    id: res.id,
    name: getName(res.masterData.current),
    description: getDescription(res.masterData.current),
    imagesUrl: getPictures(res.masterData.current),
    price: getPrice(res.masterData.current),
    discount: getDiscount(res.masterData.current),
    attributes: getAttributes(res.masterData.current),
  };
}
