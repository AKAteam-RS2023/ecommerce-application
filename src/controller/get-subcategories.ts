import { getAllCategories } from '../services/ecommerce-api';
import { ISubCategory } from '../types/category';

export const getSubCategories = async (id: string): Promise<ISubCategory[]> => {
  const res = await getAllCategories();
  return res
    .filter((item) => item.parent?.id === id)
    .map((item) => ({ id: item.id, name: item.name['en-US'] }));
};
