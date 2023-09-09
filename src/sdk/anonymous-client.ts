import fetch from 'cross-fetch';

import { ClientBuilder, HttpMiddlewareOptions, TokenCache } from '@commercetools/sdk-client-v2';

const scopes = (JSON.parse(process.env.CTP_SCOPES || '[]') as string[]).map(
  (item) => `${item}:${process.env.CTP_PROJECT_KEY}`,
);

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
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

export const anonymousClient = new ClientBuilder()
  .withHttpMiddleware(httpMiddlewareOptions)
  .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
  .build();
