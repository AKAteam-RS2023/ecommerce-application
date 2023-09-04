import { getSubCategories } from '../services/ecommerce-api';
import { ISubCategory } from '../types/category';

const LANGUAGE = 'pl-PL';

export const getISubCategories = async (id: string): Promise<ISubCategory[]> => {
  const res = await getSubCategories(id);
  return res.map((item) => ({ id: item.id, name: item.name[LANGUAGE], parent: id }));
};
