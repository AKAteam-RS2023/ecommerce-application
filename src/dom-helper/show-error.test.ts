import ShowError from './show-error';

describe('Show Error:', () => {
  const showErrorTest = new ShowError('testClass', true);

  test('should be render defined', () => {
    expect(showErrorTest.render).toBeDefined();
  });

  test('should be show defined', () => {
    expect(showErrorTest.show).toBeDefined();
  });

  test('should be hide defined', () => {
    expect(showErrorTest.hide).toBeDefined();
  });

  test('should be isError defined', () => {
    expect(showErrorTest.isError).toBeDefined();
  });
});
