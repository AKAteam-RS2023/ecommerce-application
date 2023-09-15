import {
  Category,
  Customer,
  Product,
  ProductDiscount,
  ProductProjection,
  createApiBuilderFromCtpClient,
  ClientResponse,
  CustomerUpdate,
  ProductType,
  Cart,
} from '@commercetools/platform-sdk';

import { ctpClient } from '../sdk/build-client';

import conf, { initClient } from '../sdk/create-client-user';
import Sort from '../types/sort';
import IFilters from '../types/filters';
import { anonymousClient } from '../sdk/anonymous-client';
import IProduct from '../types/product';

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: 'ecom-app-akateam',
});

let apiRootUser = createApiBuilderFromCtpClient(anonymousClient).withProjectKey({
  projectKey: 'ecom-app-akateam',
});

const removeCartId = (): void => {
  localStorage.removeItem('cartId');
};

export const upadteApiRootUser = (): void => {
  if (conf.client) {
    apiRootUser = createApiBuilderFromCtpClient(conf.client).withProjectKey({
      projectKey: 'ecom-app-akateam',
    });
  } else {
    apiRootUser = createApiBuilderFromCtpClient(anonymousClient).withProjectKey({
      projectKey: 'ecom-app-akateam',
    });
    removeCartId();
  }
};

upadteApiRootUser();

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
  try {
    const res = await apiRoot
      .me()
      .login()
      .post({
        body: {
          password,
          email,
          activeCartSignInMode: 'MergeWithExistingCustomerCart',
        },
      })
      .execute();
    if (res.body.cart) {
      localStorage.setItem('cartId', res.body.cart.id);
    }
    initClient(email, password);
    upadteApiRootUser();
    return await apiRootUser
      .me()
      .get()
      .execute()
      .then(() => {
        localStorage.setItem('userToken', conf.tokenCache.userCache.token);
        localStorage.setItem('userRefreshToken', conf.tokenCache.userCache.refreshToken || '');
        localStorage.setItem(
          'userExpirationTime',
          `${conf.tokenCache.userCache.expirationTime || 0}`,
        );
        return true;
      });
  } catch {
    conf.client = null;
    upadteApiRootUser();
    return false;
  }
};

const toStringForFilter = (set: Set<unknown>): string => [...set].map((item) => `"${item}"`).join(',');

const getFilters = (data: {
  categoryId?: string;
  sort: Sort;
  searchQuery?: string;
  filters?: IFilters;
  limit: number;
  offset: number;
}): string[] => {
  const filter: string[] = [];
  if (data.categoryId) {
    filter.push(`categories.id:"${data.categoryId}"`);
  }
  if (data.filters) {
    if (data.filters.madein && data.filters.madein.size > 0) {
      filter.push(`variants.attributes.made-in.key:${toStringForFilter(data.filters.madein)}`);
    }
    if (data.filters.colors && data.filters.colors.size > 0) {
      filter.push(`variants.attributes.color.key:${toStringForFilter(data.filters.colors)}`);
    }
    if (!Number.isNaN(data.filters.startPrice) && !Number.isNaN(data.filters.finishPrice)) {
      filter.push(
        `variants.price.centAmount:range(${data.filters.startPrice * 100} to ${
          data.filters.finishPrice * 100
        })`,
      );
    }
  }
  return filter;
};

export const getProducts = async (data: {
  categoryId?: string;
  sort: Sort;
  searchQuery?: string;
  filters?: IFilters;
  limit: number;
  offset: number;
}): Promise<{ results: ProductProjection[]; total?: number }> => {
  try {
    const filter = getFilters(data);
    const res = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter,
          sort: data.sort,
          'text.pl-PL': data.searchQuery,
          limit: data.limit,
          offset: data.offset,
        },
      })
      .execute();
    return { results: res.body.results, total: res.body.total };
  } catch {
    throw Error('Brak towarów');
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

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await apiRoot
      .categories()
      .get({
        queryArgs: {
          where: 'parent is not defined',
        },
      })
      .execute();
    return res.body.results;
  } catch {
    throw Error('No categories');
  }
};

export const getSubCategories = async (parentId: string): Promise<Category[]> => {
  try {
    const res = await apiRoot
      .categories()
      .get({
        queryArgs: {
          where: `parent(id="${parentId}")`,
        },
      })
      .execute();
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
  // const apiRootUser = createApiBuilderFromCtpClient(conf.client).withProjectKey({
  //   projectKey: process.env.CTP_PROJECT_KEY as string,
  // });

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
  // const apiRootUser = createApiBuilderFromCtpClient(conf.client).withProjectKey({
  //   projectKey: process.env.CTP_PROJECT_KEY as string,
  // });

  const res = apiRootUser.customers().withId({ ID: id }).post({ body: update }).execute();

  return res;
};

export const getProductTypesWithAttribute = async (name: string): Promise<ProductType[]> => {
  const res = await apiRoot
    .productTypes()
    .get({
      queryArgs: {
        where: `attributes(name="${name}")`,
      },
    })
    .execute();
  return res.body.results;
};

export const changePasswordApi = async (
  id: string,
  currentPassword: string,
  newPassword: string,
  version: number,
): Promise<ClientResponse<Customer>> => {
  const res = apiRoot
    .customers()
    .password()
    .post({
      body: {
        id,
        currentPassword,
        newPassword,
        version,
      },
    })
    .execute();

  return res;
};

export const createCart = async (): Promise<string> => {
  try {
    const res = await apiRootUser
      .me()
      .carts()
      .post({
        body: {
          currency: 'PLN',
          country: 'PL',
        },
      })
      .execute();
    localStorage.setItem('cartId', res.body.id);
    localStorage.setItem('cartVersion', `${res.body.version}`);
    return res.body.id;
  } catch {
    throw Error("You can't order something");
  }
};

const getVersion = (): number => {
  const version = localStorage.getItem('cartVersion');
  if (version === null || Number.isNaN(version)) {
    return 1;
  }
  return +version;
};

export const addProduct = async (cartId: string, product: IProduct): Promise<Cart> => {
  const res = await apiRootUser
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: getVersion(),
        actions: [
          {
            action: 'setCountry',
            country: 'PL',
          },
          {
            action: 'addLineItem',
            productId: product.id,
            variantId: product.variantId ? product.variantId : undefined,
            quantity: 1,
          },
        ],
      },
    })
    .execute();
  localStorage.setItem('cartVersion', `${res.body.version}`);
  return res.body;
};

export const removeProduct = async (
  cartId: string,
  lineItemId: string,
  quantity: number,
): Promise<Cart> => {
  const res = await apiRootUser
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: getVersion(),
        actions: [
          {
            action: 'setCountry',
            country: 'PL',
          },
          {
            action: 'removeLineItem',
            lineItemId,
            quantity,
          },
        ],
      },
    })
    .execute();
  localStorage.setItem('cartVersion', `${res.body.version}`);
  return res.body;
};

export const getCartById = async (cartId: string): Promise<Cart> => {
  const res = await apiRootUser.me().carts().withId({ ID: cartId }).get()
    .execute();
  localStorage.setItem('cartVersion', `${res.body.version}`);
  return res.body;
};

export const changeQuantityProducts = async (
  cartId: string,
  lineItemId: string,
  quantity: number,
): Promise<Cart> => {
  const res = await apiRootUser
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: getVersion(),
        actions: [
          {
            action: 'setCountry',
            country: 'PL',
          },
          {
            action: 'changeLineItemQuantity',
            lineItemId,
            quantity,
          },
        ],
      },
    })
    .execute();
  localStorage.setItem('cartVersion', `${res.body.version}`);
  return res.body;
};

export const deleteCart = async (cartId: string): Promise<void> => {
  apiRootUser
    .me()
    .carts()
    .withId({ ID: cartId })
    .delete({
      queryArgs: { version: getVersion() },
    })
    .execute();
  localStorage.removeItem('cartVersion');
  removeCartId();
};
