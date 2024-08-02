export interface StravaOAuthResponse {
  token_type: string
  expires_at: number
  expires_in: number
  refresh_token: string
  access_token: string
  athlete: Athlete
}

export interface Athlete {
  id: number
  username: any
  resource_state: number
  firstname: string
  lastname: string
  bio: any
  city: any
  state: any
  country: any
  sex: string
  premium: boolean
  summit: boolean
  created_at: string
  updated_at: string
  badge_type_id: number
  weight: any
  profile_medium: string
  profile: string
  friend: any
  follower: any
}

export interface RefreshAthleteAccessTokenRequest {
  expires_in?: number;
  refresh_token?: string;
  access_token?: string;
  lastRefresh?: number;
  code?: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export interface UpdateAthleteCodeRequest {
  code: string
}