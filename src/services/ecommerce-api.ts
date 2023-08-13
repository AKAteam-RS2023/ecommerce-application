import { Customer, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import { ctpClient } from '../sdk/build-client';

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: 'ecom-app-akateam',
});

export const getCustomer = async (email: string): Promise<Customer | string> => apiRoot
  .customers()
  .get()
  .execute()
  .then((customers) => {
    const customer = customers.body.results.find((element) => element.email === email);
    if (!customer) {
      throw Error("User doesn't exist with this email");
    }
    return customer;
  });

export const loginCustomer = async (email: string, password: string): Promise<boolean> => apiRoot
  .login()
  .post({ body: { email, password } })
  .execute()
  .then((user) => {
    localStorage.setItem('userID', user.body.customer.id);
    return true;
  })
  .catch(() => false);
