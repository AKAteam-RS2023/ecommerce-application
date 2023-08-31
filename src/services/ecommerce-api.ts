import {
  Category,
  Customer,
  Product,
  ProductDiscount,
  ProductProjection,
  createApiBuilderFromCtpClient,
  ClientResponse,
  CustomerUpdate,
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

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await apiRoot.products().get().execute();
    return res.body.results;
  } catch {
    throw Error('No products');
  }
};

export const getProductsByCategoryId = async (id: string): Promise<ProductProjection[]> => {
  try {
    const res = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: `categories.id:"${id}"`,
        },
      })
      .execute();
    return res.body.results;
  } catch {
    throw Error('No products');
  }
};

export const getProductDiscontById = async (id: string): Promise<ProductDiscount> => {
  const res = await apiRoot
    .productDiscounts()
    .get({
      queryArgs: {
        where: `id="${id}"`,
      },
    })
    .execute();
  return res.body.results[0];
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const res = await apiRoot.categories().get().execute();
    return res.body.results;
  } catch {
    throw Error('No categories');
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const res = await apiRoot
      .categories()
      .get({
        queryArgs: {
          where: `id="${id}"`,
        },
      })
      .execute();
    return res.body.results[0];
  } catch {
    throw Error('No category');
  }
};

export const getProfile = async (): Promise<ClientResponse<Customer>> => {
  const apiRootUser = createApiBuilderFromCtpClient(conf.client).withProjectKey({
    projectKey: process.env.CTP_PROJECT_KEY as string,
  });

  const res = await apiRootUser.me().get().execute();

  return res;
};

export const getProductById = async (productID: string): Promise<Product> => {
  try {
    const res = await apiRoot.products().withId({ ID: productID }).get().execute();
    return res.body;
  } catch {
    throw Error('Product not found');
  }
};

export const updateCustomer = async (
  id: string,
  update: CustomerUpdate,
): Promise<ClientResponse<Customer>> => {
  const apiRootUser = createApiBuilderFromCtpClient(conf.client).withProjectKey({
    projectKey: process.env.CTP_PROJECT_KEY as string,
  });

  const res = apiRootUser.customers().withId({ ID: id }).post({ body: update }).execute();

  return res;
};
