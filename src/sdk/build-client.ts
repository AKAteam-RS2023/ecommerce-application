import fetch from 'cross-fetch';
import {
  ClientBuilder,
  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

const projectKey = 'ecom-app-akateam';
const scopes = [
  'create_anonymous_token:ecom-app-akateam',
  'manage_my_business_units:ecom-app-akateam',
  'view_categories:ecom-app-akateam',
  'manage_my_profile:ecom-app-akateam',
  'manage_my_quotes:ecom-app-akateam',
  'view_published_products:ecom-app-akateam',
  'manage_my_orders:ecom-app-akateam',
  'manage_my_quote_requests:ecom-app-akateam',
  'manage_my_shopping_lists:ecom-app-akateam',
  'manage_my_payments:ecom-app-akateam',
  'view_project_settings:ecom-app-akateam',
  'manage_customers:ecom-app-akateam',
];

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey,
  credentials: {
    clientId: 'NWVWlEqXuzVLM9PAI4wLnxf6',
    clientSecret: 'znMd0VImwSYVMrwGXu4D-PLe9LyM4aI8',
  },
  scopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();
