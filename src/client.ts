import 'dotenv/config';
import { Connection, Client } from '@temporalio/client';
import { refreshAthleteAccessToken } from './workflows';
import type { RefreshAthleteAccessTokenRequest } from './types';
import { nanoid } from 'nanoid';

async function run() {
  // Create the request.
  const {STRAVA_CLIENT_ID = '', STRAVA_CLIENT_SECRET = '', STRAVA_REDIRECT_URI = ''} = process.env;
  const aRequest:RefreshAthleteAccessTokenRequest = {
    client_id: STRAVA_CLIENT_ID,
    client_secret: STRAVA_CLIENT_SECRET,
    redirect_uri: STRAVA_REDIRECT_URI
  }

  const connection = await Connection.connect({ address: 'localhost:7233' });

  const client = new Client({
    connection,
  });

  await client.workflow.start(refreshAthleteAccessToken, {
    taskQueue: 'hello-world',
    args: [aRequest],
    workflowId: 'workflow-' + nanoid(),
  });

  console.log(`Running Strava Workflow`);
  await connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
