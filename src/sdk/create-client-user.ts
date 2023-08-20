import fetch from 'cross-fetch';
import {
  ClientBuilder,
  // type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions,
  TokenCache,
  Client,
} from '@commercetools/sdk-client-v2';

import UserTokenCache from './user-token-cache';

const scopes = (JSON.parse(process.env.CTP_SCOPES as string) as string[]).map(
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

export const createClient = (
  email: string,
  password: string,
): { client: Client; tokenCache: UserTokenCache } => {
  const tokenCache = new UserTokenCache();

  const passwordAuthOptions: PasswordAuthMiddlewareOptions = {
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
  };
  return {
    client: new ClientBuilder()
      .withPasswordFlow(passwordAuthOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withLoggerMiddleware() // Include middleware for logging
      .build(),
    tokenCache,
  };
};
