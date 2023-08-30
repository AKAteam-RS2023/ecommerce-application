import { getProductsByCategoryId } from '../services/ecommerce-api';
import IProduct from '../types/product';
import { doProduct } from './get-all-products';

export default async function getProductsbyCategory(categoryId: string): Promise<IProduct[]> {
  const res = await getProductsByCategoryId(categoryId);
  return res.map(doProduct).flat();
}
