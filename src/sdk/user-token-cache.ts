import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

export default class UserTokenCache implements TokenCache {
  public userCaсhe: TokenStore = { token: '', expirationTime: 0 };

  public set(newCache: TokenStore): void {
    this.userCaсhe = newCache;
  }

  public get(): TokenStore {
    return this.userCaсhe;
  }
}
