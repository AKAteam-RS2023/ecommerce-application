import validatePassword from './validate-password';

describe('password is invalid:', () => {
  test('length < 8', () => {
    expect(() => validatePassword('1')).toThrowError();
    expect(() => validatePassword('1234567')).toThrowError();
  });

  test('at least 1 uppercase letter and 1 number', () => {
    expect(() => validatePassword('passwordddd1')).toThrowError();
    expect(() => validatePassword('Passwordddd')).toThrowError();
  });

  test('must contain special characters', () => {
    expect(() => validatePassword('Password1')).toThrowError();
  });
});

describe('password is valid:', () => {
  test('valid password', () => {
    expect(() => validatePassword('P@ssword1')).not.toThrowError();
  });
});
