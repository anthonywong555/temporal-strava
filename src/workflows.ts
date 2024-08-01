import { proxyActivities, defineQuery, setHandler, sleep, workflowInfo, continueAsNew } from '@temporalio/workflow';
import type * as activities from './activities';

export interface RefreshAthleteAccessTokenRequest {
  isCAN?: boolean;
  expires_in?: number;
  refresh_token?: string;
  access_token: string;
}

export const fetchAthleteAccessToken = defineQuery<string>('athleteAccessToken');

const { getAccessToken, refreshAccessToken } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function refreshAthleteAccessToken(aRequest: RefreshAthleteAccessTokenRequest){ 
  let {isCAN = false, expires_in = 0, refresh_token = '', access_token} = aRequest;

  if(!isCAN) {
    const response = await getAccessToken();

    if(!response) {
      throw new Error('Error on fetching access token', response);
    }
    
    expires_in = response.expires_in;
    refresh_token = response.refresh_token;
    access_token = response.access_token;

  }

  setHandler(fetchAthleteAccessToken, () => access_token);

  while(!workflowInfo().continueAsNewSuggested) {
    // Sleep for a bit
    await sleep((expires_in - 100) * 1000);

    // Refresh Token
    const response = await refreshAccessToken(refresh_token);

    expires_in = response.expires_in;
    refresh_token = response.refresh_token;
    access_token = response.access_token;
  }

  await continueAsNew({isCAN: true, expires_in, refresh_token, access_token});
}