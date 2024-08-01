import 'dotenv/config';
import strava, { RefreshTokenResponse } from 'strava-v3';

async function setupStrava() {
  const {STRAVA_CLIENT_ID = '', STRAVA_CLIENT_SECRET = '', STRAVA_REDIRECT_URI = ''} = process.env;
  strava.config({
    "access_token": '',
    "client_id"     : STRAVA_CLIENT_ID,
    "client_secret" : STRAVA_CLIENT_SECRET,
    "redirect_uri"  : STRAVA_REDIRECT_URI,
  });
}

export async function getRequestAccessURL(scope?:string): Promise<string> {
  await setupStrava();
  return await strava.oauth.getRequestAccessURL({scope});
}

export async function getAccessToken(): Promise<any> {
  await setupStrava();

  const { STRAVA_CODE = '' } = process.env;
  const accessToken = await strava.oauth.getToken(STRAVA_CODE);
  return accessToken;
}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  await setupStrava();
  const accessToken = await strava.oauth.refreshToken(refreshToken);
  return accessToken;
}