import { getProducts } from '../services/ecommerce-api';
import IProduct from '../types/product';

export default async function getAllProducts(): Promise<IProduct[]> {
  const res = await getProducts();
  const result: IProduct[] = [];
  res.forEach((item) => {
    result.push({
      id: item.id,
      name: item.masterData.current.metaTitle
        ? item.masterData.current.metaTitle['en-US']
        : 'No name',
      description: item.masterData.current.description
        ? item.masterData.current.description['en-US']
        : 'No description',
      imageUrl: item.masterData.current.masterVariant.images
        ? item.masterData.current.masterVariant.images[0].url
        : '../assets/image/image-not-found.png',
      price: item.masterData.staged.masterVariant.prices
        ? `${item.masterData.staged.masterVariant.prices[0].value.centAmount / 100} ${
          item.masterData.staged.masterVariant.prices[0].value.currencyCode
        }`
        : 'No price',
    });
    if (item.masterData.current.variants.length > 0) {
      item.masterData.current.variants.forEach((variant) => {
        result.push({
          id: item.id,
          name: item.masterData.current.metaTitle
            ? item.masterData.current.metaTitle['en-US']
            : 'No name',
          description: variant.key ? variant.key : 'No description',
          imageUrl: variant.images ? variant.images[0].url : '../assets/image/image-not-found.png',
          price: variant.prices
            ? `${variant.prices[0].value.centAmount / 100} ${variant.prices[0].value.currencyCode}`
            : 'no prices',
        });
      });
    }
  });
  return result;
}
