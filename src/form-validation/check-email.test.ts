import checkEmail from './check-email';

describe('check wrong emails:', () => {
  test('without @', () => {
    const email = 'example.com';
    expect(() => checkEmail(email)).toThrowError();
  });

  test('without domain name', () => {
    const email = 'example@com';
    expect(() => checkEmail(email)).toThrowError();
  });

  test('with whitespaces in the start', () => {
    const email = '  name@gmail.com';
    expect(() => checkEmail(email)).toThrowError();
  });

  test('with whitespace in the end', () => {
    const email = 'name@gmail.com    ';
    expect(() => checkEmail(email)).toThrowError();
  });

  test('without login name', () => {
    const email = '@gmail.com';
    expect(() => checkEmail(email)).toThrowError();
  });

  test('with wrong domain name', () => {
    const email = 'name@gmail.c';
    expect(() => checkEmail(email)).toThrowError();
  });

  test('with many dots', () => {
    const email = 'na..me@gmail.c';
    expect(() => checkEmail(email)).toThrowError();
  });
});

describe('check right emails:', () => {
  test("shouldn't return error", () => {
    const email = 'tgerr5555@rezgan.com';
    expect(() => checkEmail(email)).not.toThrowError();
  });
});
