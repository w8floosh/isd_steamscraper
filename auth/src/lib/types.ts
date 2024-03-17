import { IsEmail, MinLength } from 'class-validator';

export class UserCredentialsDto {
  @IsEmail()
  email: string;

  // @IsStrongPassword()
  @MinLength(8)
  password: string;
}
