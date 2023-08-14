import { Customer, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import { ctpClient } from '../sdk/build-client';

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: 'ecom-app-akateam',
});

export const getCustomer = async (email: string): Promise<Customer | string> => apiRoot
  .customers()
  .get({
    queryArgs: {
      where: `email="${email}"`,
    },
  })
  .execute()
  .then((response) => {
    if (response.body.results.length === 0) {
      throw Error("User doesn't exist with this email");
    }
    return response.body.results[0];
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
