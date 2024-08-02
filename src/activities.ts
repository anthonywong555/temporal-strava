import 'dotenv/config';
import strava, { RefreshTokenResponse } from 'strava-v3';
import type { StravaOAuthResponse } from './types';

async function setupStrava({client_id = '', client_secret = '', redirect_uri = ''}) {
  strava.config({
    client_id,
    client_secret,
    redirect_uri,
    "access_token": '',
  });
}

export async function getRequestAccessURL({client_id = '', client_secret = '', redirect_uri = '', scope = ''}): Promise<string> {
  await setupStrava({client_id, client_secret, redirect_uri});
  return await strava.oauth.getRequestAccessURL({scope});
}

export async function getAccessToken({client_id = '', client_secret = '', redirect_uri = '', athleteCode = ''}): Promise<StravaOAuthResponse> {
  await setupStrava({client_id, client_secret, redirect_uri});
  const accessToken = await strava.oauth.getToken(athleteCode);
  return accessToken;
}

export async function refreshAccessToken({client_id = '', client_secret = '', redirect_uri = '', refresh_token = ''}): Promise<RefreshTokenResponse> {
  await setupStrava({client_id, client_secret, redirect_uri});
  const accessToken = await strava.oauth.refreshToken(refresh_token);
  return accessToken;
}