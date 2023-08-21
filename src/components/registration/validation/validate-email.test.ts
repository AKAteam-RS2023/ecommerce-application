import validateEmail from './validate-email';

describe('invalid email:', () => {
  test('invalid domain', () => {
    expect(() => validateEmail('email@me.c')).toThrowError();
    expect(() => validateEmail('email@me')).toThrowError();
    expect(() => validateEmail('email_me')).toThrowError();
    expect(() => validateEmail('email@.com')).toThrowError();
    expect(() => validateEmail('email@m.e')).toThrowError();
  });

  test('invalid login', () => {
    expect(() => validateEmail('e@me.com')).toThrowError();
  });

  test('malformed address', () => {
    expect(() => validateEmail('e@m@a@i@l@me.com')).toThrowError();
    expect(() => validateEmail('ema.@!<>il@me.com')).toThrowError();
  });
});

describe('valid email:', () => {
  test('should not return an error', () => {
    expect(() => validateEmail('email@me.com')).not.toThrowError();
  });
});
