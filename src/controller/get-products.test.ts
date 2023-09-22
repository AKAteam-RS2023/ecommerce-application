import { ProductProjection, ProductVariant } from '@commercetools/platform-sdk';
import Sort from '../types/sort';
import getIProducts from './get-products';
import * as EcommerceAPI from '../services/ecommerce-api';

jest.mock('../services/ecommerce-api');

type ProductResult = {
  results: ProductProjection[];
  total?: number;
};

const getProductsMocked = EcommerceAPI.getProducts as jest.Mock;

const EMPTY_PRODUCTS_MOCK: ProductResult = {
  results: [],
  total: 0,
};

const MASTER_VARIANT: ProductVariant = {
  attributes: [],
  assets: [],
  key: 'Czarny',
  sku: 'BERGMUND-czarny',
  id: 1,
};

const PRODUCT: ProductProjection = {
  id: 'product-projection-id',
  name: {
    'pl-PL': 'Product #1',
  },
  productType: {
    id: 'product-id',
    typeId: 'product-type',
  },
  slug: {
    'pl-PL': 'product-projection-slug_1',
  },
  masterVariant: MASTER_VARIANT,
  variants: [],
  categories: [
    {
      typeId: 'category',
      id: 'category-id',
    },
  ],
  version: 1,
  lastModifiedAt: new Date().toDateString(),
  createdAt: new Date().toDateString(),
};

const ONE_PRODUCT_MOCK: ProductResult = {
  results: [PRODUCT],
  total: 1,
};

const GET_PRODUCTS_DATA = {
  sort: Sort.nameAsc,
  limit: 10,
  offset: 0,
};

describe('getIProducts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns zero products', async () => {
    getProductsMocked.mockImplementation(
      (): Promise<ProductResult> => Promise.resolve(EMPTY_PRODUCTS_MOCK),
    );
    const res = await getIProducts(GET_PRODUCTS_DATA);
    expect(res).toEqual({
      results: [],
      total: 0,
    });
  });
  test('returns one product no price, no description, no img', async () => {
    getProductsMocked.mockImplementation(
      (): Promise<ProductResult> => Promise.resolve(ONE_PRODUCT_MOCK),
    );
    const res = await getIProducts(GET_PRODUCTS_DATA);
    expect(res).toEqual({
      results: [
        {
          description: 'No description',
          discount: undefined,
          id: 'product-projection-id',
          imageUrl: undefined,
          name: 'Product #1',
          price: 'no price',
        },
      ],
      total: 1,
    });
  });
});
