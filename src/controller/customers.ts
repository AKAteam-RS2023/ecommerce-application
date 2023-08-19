import { getCustomer, loginCustomer } from '../services/ecommerce-api';

export const loginIfExist = async (email: string, password: string): Promise<void> => {
  await getCustomer(email);
  const flag = await loginCustomer(email, password);
  if (!flag) {
    throw Error('Password mismatch');
  }
};
