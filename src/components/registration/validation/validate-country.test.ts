import { Country } from '../country';
import validateCountry from './validate-country';

describe('validate country:', () => {
  test('country PL', () => {
    expect(() => validateCountry(Country.Poland)).not.toThrowError();
  });

  test('country LT', () => {
    expect(() => validateCountry(Country.Lithuania)).not.toThrowError();
  });

  test('country not supported', () => {
    expect(() => validateCountry('BY')).toThrowError();
  });
});
