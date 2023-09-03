import { getCategories } from '../services/ecommerce-api';
import { ICategory } from '../types/category';

const LANGUAGE = 'pl-PL';

export const getICategories = async (): Promise<ICategory[]> => {
  const res = await getCategories();
  return res.map((item) => ({ id: item.id, name: item.name[LANGUAGE] }));
};
