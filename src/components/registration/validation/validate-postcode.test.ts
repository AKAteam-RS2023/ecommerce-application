import {
  validatePostcodePoland,
  validatePostcodeLithuania,
  validatePostcodeVilnus,
} from './validate-postcode';

describe('validate postcode PL:', () => {
  test('invalid postcode', () => {
    expect(() => validatePostcodePoland('123456')).toThrowError();
  });

  test('valid postcode', () => {
    expect(() => validatePostcodePoland('15-820')).not.toThrowError();
  });
});

describe('validate postcode LT:', () => {
  test('invalid postcode', () => {
    expect(() => validatePostcodeLithuania('123456')).toThrowError();
  });

  test('valid postcode', () => {
    expect(() => validatePostcodeLithuania('15820')).not.toThrowError();
  });
});

describe('validate postcode Vilnus:', () => {
  test('invalid postcode', () => {
    expect(() => validatePostcodeVilnus('12345')).toThrowError();
  });

  test('valid postcode', () => {
    expect(() => validatePostcodeVilnus('123456')).not.toThrowError();
  });
});
