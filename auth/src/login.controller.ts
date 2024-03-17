import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { AuthorizationServer, JwtService } from '@jmondi/oauth2-server';
import { Request, Response } from 'express';
import { UserService } from './services/user.service';
import { UserCredentialsDto } from './lib/types';
import { User } from './modules/oauth/entities';
import { hash } from 'bcrypt';
import { SALT_ROUNDS } from './lib/constants';
import { InvalidCredentialsException } from './lib/errors';

@Controller('login')
export class LoginController {
  constructor(
    @Inject('AUTH_SERVER')
    private readonly authorizationServer: AuthorizationServer,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() credentials: UserCredentialsDto,
  ): Promise<void> {
    const authRequest =
      await this.authorizationServer.validateAuthorizationRequest(request);

    const { email, password } = credentials;
    const user = await this.userService.getUserByCredentials(
      email,
      password,
      'authorization_code',
      authRequest.client,
    );

    if (!user) throw new InvalidCredentialsException();

    const updatedUser = User.create({
      ...user,
      lastLoginAt: new Date(),
      lastLoginIP: request.ip,
    });

    await this.userService.updateUser(updatedUser);

    const token = await this.jwtService.sign({
      userId: user.id,
      email: user.email,

      iat: Math.floor(Date.now() / 1000),
      exp: Date.now() + 5 * 1000, // 5 seconds
    });

    response.cookie('jid', token, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days
    });

    // query URL must have the following params at this point: response_type, client_id, redirect_uri, scope, state, code_challenge, code_challenge_method
    const query = request.url.split('?')[1];
    response.redirect(`/oauth2/authorize?${query}`);
  }

  @Post('/signup')
  async signup(@Body() credentials: UserCredentialsDto): Promise<void> {
    const { email, password } = credentials;
    await this.userService.registerUser(
      User.create({
        id: await hash(email, SALT_ROUNDS),
        email,
        passwordHash: await hash(password, SALT_ROUNDS),
      }),
    );
  }
}
