import { Connection, Client } from '@temporalio/client';
import { refreshAthleteAccessToken } from './workflows';
import type { RefreshAthleteAccessTokenRequest } from './workflows';
import { nanoid } from 'nanoid';

async function run() {
  // Create Request
  const aRequest:RefreshAthleteAccessTokenRequest = {
    isCAN: false,
    access_token: ''
  }

  // Connect to the default Server location
  const connection = await Connection.connect({ address: 'localhost:7233' });
  // In production, pass options to configure TLS and other settings:
  // {
  //   address: 'foo.bar.tmprl.cloud',
  //   tls: {}
  // }

  const client = new Client({
    connection,
    // namespace: 'foo.bar', // connects to 'default' namespace if not specified
  });

  const handle = await client.workflow.execute(refreshAthleteAccessToken, {
    taskQueue: 'hello-world',
    // type inference works! args: [name: string]
    args: [aRequest],
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: 'workflow-' + nanoid(),
  });

  console.log(`Running Strava Workflow`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
