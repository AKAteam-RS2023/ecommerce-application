import validateBirthdate from './validate-birthdate';

describe('validate birthdate:', () => {
  test('age less than 13', () => {
    const date = '2023-01-01';
    expect(() => validateBirthdate(date)).toThrowError();
  });

  test('age more than 120', () => {
    const date = '1900-01-01';
    expect(() => validateBirthdate(date)).toThrowError();
  });

  test('invalid date', () => {
    const date = 'invalid date';
    expect(() => validateBirthdate(date)).toThrowError();
  });

  test('date does not exist', () => {
    const date = '2023-02-30';
    expect(() => validateBirthdate(date)).toThrowError();
  });

  test('date is empty', () => {
    expect(() => validateBirthdate('')).toThrowError();
  });
});

describe('valid birthdate:', () => {
  test('should pass', () => {
    const date = '1991-08-09';
    expect(() => validateBirthdate(date)).not.toThrowError();
  });
});
