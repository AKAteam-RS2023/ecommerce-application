import { Customer, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import { ctpClient, client } from '../sdk';

import { tokenCache } from '../sdk/buil-client-user';

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: 'ecom-app-akateam',
});

const apiRootUser = createApiBuilderFromCtpClient(client).withProjectKey({
  projectKey: process.env.CTP_PROJECT_KEY as string,
});

apiRootUser.me().get().execute().then(console.log)
  .catch(console.log);

console.log(tokenCache);

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
