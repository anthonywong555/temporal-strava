import { proxyActivities, defineQuery, defineSignal,setHandler, sleep, workflowInfo, continueAsNew, condition } from '@temporalio/workflow';
import ms from 'ms';
import type * as activities from './activities';
import { RefreshAthleteAccessTokenRequest, UpdateAthleteCodeRequest } from './types';

export const STRAVA_ATHLETE_ACCESS_TOKEN_QUERY = 'getAthleteAccessToken';
export const STRAVA_ATHLETE_CODE_SIGNAL = 'updateAthleteCode';
export const getAthleteAccessToken = defineQuery<string | undefined>(STRAVA_ATHLETE_ACCESS_TOKEN_QUERY);
export const updateAthleteCode = defineSignal<[UpdateAthleteCodeRequest]>(STRAVA_ATHLETE_CODE_SIGNAL);

// Used to determine when to refresh the token.
export const FIVE_MINS_IN_SECONDS = 300;

const { getAccessToken, refreshAccessToken } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function refreshAthleteAccessToken(aRefreshAthleteAccessTokenRequest: RefreshAthleteAccessTokenRequest) {
  const {client_id, client_secret, redirect_uri} = aRefreshAthleteAccessTokenRequest;
  let {expires_in = 0, refresh_token = '', access_token, lastRefresh = 0, code = ''} = aRefreshAthleteAccessTokenRequest;
  let hasCodeChange = false;

  let tokenExpiryPeriod = ms(`${expires_in}s`);
  let tokenRefreshInterval = expires_in ? ms(`${expires_in - FIVE_MINS_IN_SECONDS}s`) : ms(`0s`); // 5mins

  // Query Handler
  setHandler(getAthleteAccessToken, () => 
    Date.now() - lastRefresh < tokenExpiryPeriod ? access_token : undefined
  );

  // Signal Handler
  setHandler(updateAthleteCode, async (aUpdateAthleteCodeRequest: UpdateAthleteCodeRequest) => {
    hasCodeChange = true;
    code = aUpdateAthleteCodeRequest.code;
  });

  // Waiting for the users to signal in the athlete's code.
  if(!code) {
    await condition(() => hasCodeChange);
    hasCodeChange = false;
  }
  
  const response = refresh_token ? 
    await refreshAccessToken({client_id, client_secret, redirect_uri, refresh_token}) : 
    await getAccessToken({client_id, client_secret, redirect_uri, athleteCode: code});

  lastRefresh = Date.now();
  expires_in = response.expires_in;
  refresh_token = response.refresh_token;
  access_token = response.access_token;

  tokenExpiryPeriod = ms(`${expires_in}s`);
  tokenRefreshInterval = ms(`${expires_in - FIVE_MINS_IN_SECONDS}s`);


  if(await condition(() => hasCodeChange, tokenRefreshInterval)) {
    refresh_token = '';
  }

  await continueAsNew<typeof refreshAthleteAccessToken>({lastRefresh, access_token, refresh_token, code, client_id, client_secret, redirect_uri});
}