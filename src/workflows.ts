import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

export interface RefreshAthleteAccessTokenRequest {
  scope: string;
  isCAN?: boolean;
  expires_in?: number;
  refresh_token?: string;
}

const { greet, getRequestAccessURL, getAccessToken, refreshAccessToken } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
  return await greet(name);
}

export async function refreshAthleteAccessToken(aRequest: RefreshAthleteAccessTokenRequest):Promise<string> {
  const {scope, isCAN = false, expires_in = 0, refresh_token = ''} = aRequest;
  //const stravaAccessURL = await getRequestAccessURL(scope);
  //console.log(stravaAccessURL);
  //return stravaAccessURL;
  //const accessToken = await getAccessToken();
  const result = await refreshAccessToken('');
  return JSON.stringify(result);
}