import { Customer, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import { ctpClient } from '../sdk/build-client';

import conf, { initClient } from '../sdk/create-client-user';
import IProduct from '../types/product';

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
      localStorage.setItem('userToken', conf.tokenCache.userCaсhe.token);
      localStorage.setItem('userRefreshToken', conf.tokenCache.userCaсhe.refreshToken || '');
      localStorage.setItem(
        'userExpirationTime',
        `${conf.tokenCache.userCaсhe.expirationTime || 0}`,
      );
      return true;
    })
    .catch(() => {
      conf.client = null;
      return false;
    });
};

export const getProducts = async (): Promise<IProduct[] | string> => {
  try {
    const res = await apiRoot.products().get().execute();
    return res.body.results.map((item) => ({
      id: item.id,
      name: item.masterData.current.metaTitle ? item.masterData.current.metaTitle['en-US'] : '',
      description: item.masterData.current.description
        ? item.masterData.current.description['en-US']
        : '',
      imageUrl: item.masterData.current.masterVariant.images
        ? item.masterData.current.masterVariant.images[0].url
        : '',
      price: item.masterData.staged.masterVariant.prices
        ? `${item.masterData.staged.masterVariant.prices[0].value.centAmount / 100} ${
          item.masterData.staged.masterVariant.prices[0].value.currencyCode
        }`
        : '',
    }));
  } catch {
    return 'No products';
  }
};
