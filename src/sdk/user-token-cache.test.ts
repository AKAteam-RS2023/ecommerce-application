import UserTokenCache from './user-token-cache';

describe('Token Cache:', () => {
  const tokenTest = new UserTokenCache();

  test('should be get defined', () => {
    expect(tokenTest.get).toBeDefined();
  });

  test('should be set defined', () => {
    expect(tokenTest.set).toBeDefined();
  });

  test('should be userCache defined', () => {
    expect(tokenTest.userCaсhe).toBeDefined();
  });

  test('userCache should have token and refresh token', () => {
    expect(Object.keys(tokenTest.userCaсhe)).toContain('token');
    expect(Object.keys(tokenTest.userCaсhe)).toContain('refreshToken');
  });
});
