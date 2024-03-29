export interface IUser {
  email: string;
  username: string;
  lastLoginAt: number;
  lastLoginIP: string;
  steamWebAPIToken: string;
}

export type UserCredentials = {
  email: string;
  password: string;
  steamWebAPIToken?: string;
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

export type SessionResponse = {
  user: IUser;
  token: string;
};

export type SessionCookieVerifierResponse = {
  user: IUser;
  token: string;
  refresh: boolean;
};

export enum AuthenticationError {
  INVALID_SESSION = 'Invalid or missing session token',
  EXPIRED_SESSION = 'Session expired',
  GENERIC = 'Generic error',
}
