import validateStreet from './validate-street';

describe('validate street:', () => {
  test('invalid street', () => {
    expect(() => validateStreet('')).toThrowError();
  });

  test('valid street', () => {
    expect(() => validateStreet('21th Avenue')).not.toThrowError();
  });
});
