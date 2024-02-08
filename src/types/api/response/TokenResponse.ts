export interface TokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshTokenResponse extends Omit<TokenResponse, 'refresh_token'> {}
