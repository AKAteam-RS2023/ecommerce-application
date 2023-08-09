import checkPassword from './check-password';

describe('check password:', () => {
  test('with wrong length', () => {
    const password = 'eA8^';
    expect(checkPassword(password)).toBe(false);
  });

  test('without lowercase letter', () => {
    const password = 'AD67IO$%';
    expect(checkPassword(password)).toBe(false);
  });

  test('without uppercase letter', () => {
    const password = 'jhgu&*n0';
    expect(checkPassword(password)).toBe(false);
  });

  test('with whitespaces', () => {
    const password = '1  lIO$%';
    expect(checkPassword(password)).toBe(false);
  });

  test('without  special character', () => {
    const password = 'op89Hb67';
    expect(checkPassword(password)).toBe(false);
  });

  test('without digit', () => {
    const password = 'bnf*$Hnb';
    expect(checkPassword(password)).toBe(false);
  });

  test('should return true', () => {
    const password = '9GTnj*$0';
    expect(checkPassword(password)).toBe(true);
  });
});
