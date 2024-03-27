import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorizationServer, JwtService } from '@jmondi/oauth2-server';
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserCredentialsDto } from '../lib/types';
import { User } from '../entities';
import { hash } from 'bcrypt';
import { SALT_ROUNDS } from '../lib/constants';
import { InvalidCredentialsException } from '../lib/errors';
import { ClientService } from '../services/client.service';
import { RedisInterceptor } from './interceptors/redis.interceptor';

@Controller('login')
@UseInterceptors(RedisInterceptor)
export class LoginController {
  constructor(
    @Inject('AUTH_SERVER')
    private readonly authorizationServer: AuthorizationServer,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly clientService: ClientService,
  ) {}

  @Post()
  async login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() credentials: UserCredentialsDto,
  ): Promise<void> {
    if (
      !(await this.clientService.getByIdentifier(
        request.query.client_id as string,
      ))
    )
      await this.clientService.register(request);

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
      lastLoginAt: new Date().getTime() * 1000,
      lastLoginIP: request.ip.split(':').pop(),
    });

    await this.userService.updateUser(updatedUser);

    const token = await this.jwtService.sign({
      user: updatedUser,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + 60 * 1000) / 1000), // 5 seconds
    });

    response.cookie('jid', token, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days
    });

    // query URL must have the following params at this point: response_type, client_id, redirect_uri, scope, state, code_challenge, code_challenge_method
    const query = request.url.split('?')[1];
    response.redirect(`/oauth/authorize?${query}`);
  }

  @Post('/signup')
  async signup(
    @Req() request: Request,
    @Body() credentials: UserCredentialsDto,
  ): Promise<void> {
    const { email, password, steamWebAPIToken } = credentials;
    await this.userService.registerUser(
      User.create({
        id: email.concat(await hash(email, SALT_ROUNDS)),
        email,
        username: email,
        steamWebAPIToken,
        passwordHash: await hash(password, SALT_ROUNDS),
        createdAt: new Date().getTime() * 1000,
        createdIP: request.ip.split(':').pop(),
        lastLoginAt: 0,
        lastLoginIP: '',
      }),
    );
  }
}
