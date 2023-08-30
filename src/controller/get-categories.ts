import { getAllCategories } from '../services/ecommerce-api';
import { ICategory } from '../types/category';

const LANGUAGE = 'pl-PL';

export const getCategories = async (): Promise<ICategory[]> => {
  const res = await getAllCategories();
  return res
    .filter((item) => !item.parent)
    .map((item) => ({ id: item.id, name: item.name[LANGUAGE] }));
};
