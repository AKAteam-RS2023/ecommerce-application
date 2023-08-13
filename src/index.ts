import {
  ApiRoot,
  ClientResponse,
  Project,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

import { ctpClient } from './sdk/build-client';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: 'ecom-app-akateam',
});

// const getProject = (): Promise<ClientResponse<Project>> => apiRoot
//   .get()
//   .execute();

// Retrieve Project information and output the result to the log
apiRoot
  .me()
  .login()
  .post({
    body: {
      email: 'test@gmail.com',
      password: 'Gz@c!phdPAbnF5j',
    },
  })
  .execute()
  .then(console.log)
  .catch(console.log);
