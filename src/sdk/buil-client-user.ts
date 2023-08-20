import fetch from 'cross-fetch';
import {
  ClientBuilder,
  // type AuthMiddlewareOptions, // Required for auth
  // type HttpMiddlewareOptions,
  TokenCache,
} from '@commercetools/sdk-client-v2';

import UserTokenCache from './user-token-cache';

const scopes = (JSON.parse(process.env.CTP_SCOPES as string) as string[]).map(
  (item) => `${item}:${process.env.CTP_PROJECT_KEY}`,
);

// Configure authMiddlewareOptions
// const authMiddlewareOptions: AuthMiddlewareOptions = {
//   host: process.env.CTP_AUTH_URL as string,
//   projectKey: process.env.CTP_PROJECT_KEY as string,
//   credentials: {
//     clientId: process.env.CTP_CLIENT_ID as string,
//     clientSecret: process.env.CTP_CLIENT_SECRET as string,
//   },
//   scopes,
//   fetch,
// };

// // Configure httpMiddlewareOptions
// const httpMiddlewareOptions: HttpMiddlewareOptions = {
//   host: process.env.CTP_API_URL as string,
//   fetch,
// };

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

const passwordAuthOptions: PasswordAuthMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL as string,
  projectKey: process.env.CTP_PROJECT_KEY as string,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID as string,
    clientSecret: process.env.CTP_CLIENT_SECRET as string,
    user: {
      username: 'example@example.com',
      password: 'XPthjWCjcP8ihtq!',
    },
  },
  scopes,
  fetch,
  tokenCache,
};

// Export the ClientBuilder
export const client = new ClientBuilder()
  .withPasswordFlow(passwordAuthOptions)
  // .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();
