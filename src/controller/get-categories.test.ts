import { Category } from '@commercetools/platform-sdk';

import { getICategories } from './get-categories';
import * as EcommerceAPI from '../services/ecommerce-api';

jest.mock('../services/ecommerce-api');

const getCategoriesMocked = EcommerceAPI.getCategories as jest.Mock;

const EMPTY_CATEGORIES_MOCK: Category[] = [];

const CATEGORY: Category = {
  id: 'category-id',
  name: {
    'pl-PL': 'Category #1',
  },
  slug: {
    'pl-PL': 'category-slug_1',
  },
  version: 1,
  lastModifiedAt: new Date().toDateString(),
  createdAt: new Date().toDateString(),
  ancestors: [],
  orderHint: 'category-order-hint',
};

const ONE_CATEGORY_MOCK: Category[] = [CATEGORY];

describe('getICategories', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns zero categories', async () => {
    getCategoriesMocked.mockImplementation(
      (): Promise<Category[]> => Promise.resolve(EMPTY_CATEGORIES_MOCK),
    );
    const res = await getICategories();
    expect(res).toEqual([]);
  });
  test('returns one category', async () => {
    getCategoriesMocked.mockImplementation(
      (): Promise<Category[]> => Promise.resolve(ONE_CATEGORY_MOCK),
    );
    const res = await getICategories();
    expect(res).toEqual([
      {
        id: 'category-id',
        name: 'Category #1',
      },
    ]);
  });
});
