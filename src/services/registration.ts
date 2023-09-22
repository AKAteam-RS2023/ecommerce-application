import {
  ClientResponse,
  createApiBuilderFromCtpClient,
  CustomerSignInResult,
  CustomerDraft,
} from '@commercetools/platform-sdk';

import { ctpClient } from '../sdk/build-client';

// Create apiRoot from the imported ClientBuilder and include your Project key
export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: 'ecom-app-akateam',
});

export function createCustomer(
  customer: CustomerDraft,
): Promise<ClientResponse<CustomerSignInResult>> {
  return apiRoot.customers().post({ body: customer }).execute();
}
