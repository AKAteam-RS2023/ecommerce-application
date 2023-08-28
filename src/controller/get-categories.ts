import { getAllCategories } from '../services/ecommerce-api';
import { ISubCategory } from '../types/category';

export const getCategories = async (): Promise<ISubCategory[]> => {
  const res = await getAllCategories();
  return res
    .filter((item) => !item.parent)
    .map((item) => ({ id: item.id, name: item.name['en-US'] }));
};
