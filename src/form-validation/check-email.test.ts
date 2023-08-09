import checkEmail from './check-email';

describe('check email:', () => {
  test('without @', () => {
    const email = 'example.com';
    expect(checkEmail(email)).toBe(false);
  });

  test('without domain name', () => {
    const email = 'example@com';
    expect(checkEmail(email)).toBe(false);
  });

  test('with whitespaces in the start', () => {
    const email = '  name@gmail.com';
    expect(checkEmail(email)).toBe(false);
  });

  test('with whitespace in the end', () => {
    const email = 'name@gmail.com    ';
    expect(checkEmail(email)).toBe(false);
  });

  test('without login name', () => {
    const email = '@gmail.com';
    expect(checkEmail(email)).toBe(false);
  });

  test('with wrong domain name', () => {
    const email = 'name@gmail.c';
    expect(checkEmail(email)).toBe(false);
  });

  test('should return true', () => {
    const email = 'tgerr5555@rezgan.com';
    expect(checkEmail(email)).toBe(true);
  });
});
