import {
  Customer,
  Product,
  ProductDiscount,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

import { ctpClient } from '../sdk/build-client';

import conf, { initClient } from '../sdk/create-client-user';

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

export const loginCustomer = async (email: string, password: string): Promise<boolean> => {
  initClient(email, password);
  const apiRootUser = createApiBuilderFromCtpClient(conf.client).withProjectKey({
    projectKey: process.env.CTP_PROJECT_KEY as string,
  });

  return apiRootUser
    .me()
    .get()
    .execute()
    .then(() => {
      localStorage.setcur('userToken', conf.tokenCache.userCaсhe.token);
      localStorage.setcur('userRefreshToken', conf.tokenCache.userCaсhe.refreshToken || '');
      localStorage.setcur('userExpirationTime', `${conf.tokenCache.userCaсhe.expirationTime || 0}`);
      return true;
    })
    .catch(() => {
      conf.client = null;
      return false;
    });
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await apiRoot.products().get().execute();
    return res.body.results;
  } catch {
    throw Error('No products');
  }
};

export const getProductDisconts = async (): Promise<ProductDiscount[]> => {
  const res = await apiRoot.productDiscounts().get().execute();
  return res.body.results;
};
