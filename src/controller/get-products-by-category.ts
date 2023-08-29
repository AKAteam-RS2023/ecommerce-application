import { Product } from '@commercetools/platform-sdk';
import { getProductByID, getProductsByCategoryId } from '../services/ecommerce-api';
import IProduct from '../types/product';
import { doProduct } from './get-all-products';

export default async function getProductsbyCategory(categoryId: string): Promise<IProduct[]> {
  const res = await getProductsByCategoryId(categoryId);
  const results = await Promise.allSettled(res.map((item) => getProductByID(item.id)));
  const products: Product[] = [];
  results.forEach((promise) => {
    if (promise.status === 'fulfilled') {
      products.push(promise.value);
    }
  });
  return products.map(doProduct);
}
