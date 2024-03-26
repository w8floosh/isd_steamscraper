export type UserCredentials = {
  email: string;
  password: string;
};

export type GetAppDataOptions = {
  details?: {
    filters?: string;
    cc?: string;
    language?: string;
  };
  news?: {
    count?: number;
    maxlength?: number;
  };
};

export type TokenResponse = {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  refresh_token: string;
  scope: string;
};