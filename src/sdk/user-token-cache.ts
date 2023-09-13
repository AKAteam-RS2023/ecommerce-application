import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

export default class UserTokenCache implements TokenCache {
  public userCache: TokenStore = {
    token: localStorage.getItem('userToken') || '',
    expirationTime: +(localStorage.getItem('userExpirationTime') || 0),
    refreshToken: localStorage.getItem('userRefreshToken') || '',
  };

  public set(newCache: TokenStore): void {
    this.userCache = newCache;
  }

  public get(): TokenStore {
    return this.userCache;
  }
}
