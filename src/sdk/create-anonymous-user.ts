import fetch from 'cross-fetch';

import { ClientBuilder, HttpMiddlewareOptions, TokenCache } from '@commercetools/sdk-client-v2';
import UserTokenCache from './user-token-cache';

const scopes = (JSON.parse(process.env.CTP_SCOPES || '[]') as string[]).map(
  (item) => `${item}:${process.env.CTP_PROJECT_KEY}`,
);

const tokenCache = new UserTokenCache();

type AnonymousAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    anonymousId?: string;
  };
  scopes?: string[];
  oauthUri?: string;
  fetch?: typeof fetch;
  tokenCache?: TokenCache;
};

type RefreshAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
  };
  scopes?: string[];
  refreshToken: string;
  tokenCache?: TokenCache;
  oauthUri?: string;
  fetch?: typeof fetch;
};

const anonymousAuthMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL as string,
  projectKey: process.env.CTP_PROJECT_KEY as string,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID as string,
    clientSecret: process.env.CTP_CLIENT_SECRET as string,
    // anonymousId: process.env.CTP_CLIENT_ID, // a unique id
  },
  scopes,
  fetch,
  tokenCache,
};

const initRefreshAuthMiddlewareOptions = (refreshToken: string): RefreshAuthMiddlewareOptions => ({
  host: process.env.CTP_AUTH_URL as string,
  projectKey: 'test-project-key',
  credentials: {
    clientId: process.env.CTP_CLIENT_ID as string,
    clientSecret: process.env.CTP_CLIENT_SECRET as string,
  },
  refreshToken,
  tokenCache,
  scopes,
  fetch,
});

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

const anonymousClient = tokenCache.userCache.refreshToken !== ''
  ? new ClientBuilder()
    .withRefreshTokenFlow(
      initRefreshAuthMiddlewareOptions(`Bearer ${tokenCache.userCache.refreshToken}`),
    )
    .withHttpMiddleware(httpMiddlewareOptions)
    .build()
  : new ClientBuilder()
    .withHttpMiddleware(httpMiddlewareOptions)
    .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
    .build();

const anonymConf = {
  client: anonymousClient,
  tokenCache,
};

export default anonymConf;
