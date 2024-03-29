import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorizationServer, JwtService } from '@jmondi/oauth2-server';
import { requestFromExpress } from '@jmondi/oauth2-server/express';
import { Request, Response } from 'express';
import { UserMiddleware } from './interceptors/user.middleware';
import { User } from '../entities';
import { ClientService } from 'src/services/client.service';

@Controller('oauth')
export class OAuthController {
  constructor(
    @Inject('AUTH_SERVER')
    private readonly authorizationServer: AuthorizationServer,
    private readonly clientService: ClientService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('token')
  async getToken(
    @Req() request: Request & { user: User },
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokenResponse =
      await this.authorizationServer.respondToAccessTokenRequest(
        requestFromExpress(request),
      );
    response.status(tokenResponse.status);

    const { scopes, ...tokenData } = tokenResponse.body;
    const sessionExpiry = Math.floor(
      (Date.now() + 15 * 24 * 60 * 60 * 1000) / 1000,
    );
    const sessionCookie = await this.jwtService.sign({
      tokenData,
      user: request.user?.id,
      iat: Math.floor(Date.now() / 1000),
      exp: sessionExpiry, // 15 days
    });
    response.clearCookie('jid');
    response.cookie('session', sessionCookie, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      encode: String,
    });
    console.log(
      response.getHeader('Set-Cookie').toString().length,
      sessionCookie.length,
    );
    return tokenResponse.body;
  }

  @Get('authorize')
  @UseInterceptors(UserMiddleware)
  async authorizeRequest(
    @Req() request: Request & { user: User },
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ code: string; state: string; user: Partial<User> }> {
    const authRequest =
      await this.authorizationServer.validateAuthorizationRequest(request);

    authRequest.user = request.user;

    authRequest.isAuthorizationApproved =
      !!authRequest.user &&
      (await this.clientService.isClientValid(
        'authorization_code',
        authRequest.client,
      ));

    const oauthResponse =
      await this.authorizationServer.completeAuthorizationRequest(authRequest);
    // avoid CORS preflight error
    // response.setHeader(
    //   'Access-Control-Allow-Origin',
    //   response.getHeader('Access-Control-Allow-Origin').toString().concat('/'),
    // );

    response.set(oauthResponse.headers);
    const redirect = new URL(oauthResponse.headers.location);
    return {
      code: redirect.searchParams.get('code'),
      state: redirect.searchParams.get('state'),
      user: {
        email: request.user.email,
        username: request.user.username,
        steamWebAPIToken: request.user.steamWebAPIToken,
        lastLoginAt: request.user.lastLoginAt,
        lastLoginIP: request.user.lastLoginIP,
      },
    };
    // return handleExpressResponse(response, oauthResponse);
  }
}
