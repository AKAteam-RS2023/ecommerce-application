import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

export default class UserTokenCache implements TokenCache {
  constructor(public userType: string = 'anonym') {
    this.userType = userType;
  }

  public userCache: TokenStore = {
    token: localStorage.getItem(`${this.userType}Token`) || '',
    expirationTime: +(localStorage.getItem(`${this.userType}ExpirationTime`) || 0),
    refreshToken: localStorage.getItem(`${this.userType}RefreshToken`) || '',
  };

  public set(newCache: TokenStore): void {
    this.userCache = newCache;
  }

  public get(): TokenStore {
    return this.userCache;
  }
}
