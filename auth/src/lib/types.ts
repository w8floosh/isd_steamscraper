import { IsEmail, MinLength } from 'class-validator';

export class UserCredentialsDto {
  @IsEmail()
  email: string;

  // @IsStrongPassword()
  @MinLength(8)
  password: string;
}

export type AuthorizeEndpointParsedQs = {
  response_type: 'code';
  client_id: string;
  redirect_uri: string;
  state: string;
  code_challenge: string;
  code_challenge_method: 'S256';
};
