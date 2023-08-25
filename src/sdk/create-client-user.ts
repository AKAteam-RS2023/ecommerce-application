import fetch from 'cross-fetch';
import {
  ClientBuilder,
  // type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions,
  TokenCache,
  Client,
} from '@commercetools/sdk-client-v2';

import UserTokenCache from './user-token-cache';

const scopes = (JSON.parse(process.env.CTP_SCOPES || '[]') as string[]).map(
  (item) => `${item}:${process.env.CTP_PROJECT_KEY}`,
);

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL as string,
  fetch,
};

type PasswordAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    user: {
      username: string;
      password: string;
    };
  };
  scopes?: string[];
  tokenCache?: TokenCache;
  oauthUri?: string;
  fetch?: typeof fetch;
};

const tokenCache = new UserTokenCache();

type ExistingTokenMiddlewareOptions = {
  force?: boolean;
};

const authorization = `Bearer ${tokenCache.userCaсhe.token}`;

const options: ExistingTokenMiddlewareOptions = {
  force: true,
};

const conf: {
  client: Client | null;
  tokenCache: UserTokenCache;
} = {
  client:
    tokenCache.userCaсhe.token === ''
      ? null
      : new ClientBuilder()
        .withExistingTokenFlow(authorization, options)
        .withHttpMiddleware(httpMiddlewareOptions)
        .withLoggerMiddleware()
        .build(),
  tokenCache,
};

const initPasswordAuthOptions = (
  email: string,
  password: string,
): PasswordAuthMiddlewareOptions => ({
  host: process.env.CTP_AUTH_URL as string,
  projectKey: process.env.CTP_PROJECT_KEY as string,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID as string,
    clientSecret: process.env.CTP_CLIENT_SECRET as string,
    user: {
      username: email,
      password,
    },
  },
  scopes,
  fetch,
  tokenCache,
});

export const initClient = (email: string, password: string): void => {
  if (conf.client) {
    return;
  }
  conf.client = new ClientBuilder()
    .withPasswordFlow(initPasswordAuthOptions(email, password))
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware() // Include middleware for logging
    .build();
};

export default conf;
