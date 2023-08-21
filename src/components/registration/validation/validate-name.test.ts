import validateName from './validate-name';

describe('name is invalid:', () => {
  test('invalid name', () => {
    expect(() => validateName('John1')).toThrowError();
    expect(() => validateName('John@')).toThrowError();
    expect(() => validateName('John!')).toThrowError();
  });
});

describe('name is valid:', () => {
  test('should not return an error', () => {
    expect(() => validateName('John')).not.toThrowError();
  });
});
