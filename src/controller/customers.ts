import { getCustomer, loginCustomer } from '../services/ecommerce-api';

export const loginIfExist = async (email: string, password: string): Promise<void> => {
  try {
    await getCustomer(email);
    const flag = await loginCustomer(email, password);
    if (flag) {
      console.log('Successful');
    } else {
      console.log('Password is wrong');
    }
  } catch (e) {
    if (!(e instanceof Error)) {
      return;
    }
    console.log(e.message);
  }
};
