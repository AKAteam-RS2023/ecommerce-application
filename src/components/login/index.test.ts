import Login from './index';

describe('Login:', () => {
  const loginTest = new Login();

  test('should be render defined', () => {
    expect(loginTest.render).toBeDefined();
  });

  test('render should return HTMLElement', () => {
    expect(loginTest.render() instanceof HTMLElement).toEqual(true);
  });
});
