import { Country } from './country';

describe('validate country code:', () => {
  test('code PL', () => {
    expect(Country.getCountryCode(Country.Poland)).toEqual('PL');
  });

  test('Poland is case insensitive', () => {
    expect(Country.getCountryCode('PoLaNd')).toEqual('PL');
  });

  test('code LT', () => {
    expect(Country.getCountryCode(Country.Lithuania)).toEqual('LT');
  });

  test('Lithuania is case insensitive', () => {
    expect(Country.getCountryCode('LithUania')).toEqual('LT');
  });

  test('code LT is default', () => {
    expect(Country.getCountryCode('Some Other Country')).toEqual('LT');
  });
});
