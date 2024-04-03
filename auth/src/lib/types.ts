import {
  IsAlphanumeric,
  IsEmail,
  IsNumberString,
  Length,
  MinLength,
} from 'class-validator';
import { User } from 'src/entities';

export class UserCredentialsDto {
  @IsEmail()
  email: string;

  // @IsStrongPassword()
  @MinLength(8)
  password: string;

  @IsAlphanumeric()
  steamWebAPIToken: string;

  @IsNumberString()
  @Length(17, 17)
  steamId: string;
}

export type AuthorizeEndpointParsedQs = {
  response_type: 'code';
  client_id: string;
  redirect_uri: string;
  state: string;
  code_challenge: string;
  code_challenge_method: 'S256' | 'plain';
};

export type SessionCookie = {
  tokenData: SessionToken;
  user: string;
  iat: number;
  exp: number;
};

export type SessionToken = {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  refresh_token: string;
  scope: string;
};

export type SessionVerificationResponse = {
  user: User;
  token: string | SessionToken;
  refresh: boolean;
};
