import checkPassword from './check-password';

describe('check password:', () => {
  test('with wrong length', () => {
    const password = 'eA8^';
    expect(() => checkPassword(password)).toThrowError();
  });

  test('without lowercase letter', () => {
    const password = 'AD67IO$%';
    expect(() => checkPassword(password)).toThrowError();
  });

  test('without uppercase letter', () => {
    const password = 'jhgu&*n0';
    expect(() => checkPassword(password)).toThrowError();
  });

  test('with whitespaces', () => {
    const password = '1lIO$%  ';
    expect(() => checkPassword(password)).toThrowError();
  });

  test('without  special character', () => {
    const password = 'op89Hb67';
    expect(() => checkPassword(password)).toThrowError();
  });

  test('without digit', () => {
    const password = 'bnf*$Hnb';
    expect(() => checkPassword(password)).toThrowError();
  });

  test("shouldn't return error", () => {
    const password = '9GTnj*$0';
    expect(() => checkPassword(password)).not.toThrowError();
  });
});
