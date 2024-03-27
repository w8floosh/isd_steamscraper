import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorizationServer } from '@jmondi/oauth2-server';
import { requestFromExpress } from '@jmondi/oauth2-server/express';
import { Request, Response } from 'express';
import { UserMiddleware } from './interceptors/user.interceptor';
import { User } from '../entities';
import { ClientService } from 'src/services/client.service';

@Controller('oauth')
export class OAuthController {
  constructor(
    @Inject('AUTH_SERVER')
    private readonly authorizationServer: AuthorizationServer,
    private readonly clientService: ClientService,
  ) {}

  @Post('token')
  async getToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: Record<string, any>,
  ): Promise<Record<string, any>> {
    console.log(
      // JSON.parse(
      //   Buffer.from(body['code'].split(':')[1], 'base64').toString('utf-8'),
      // ),
      body,
    );
    const tokenResponse =
      await this.authorizationServer.respondToAccessTokenRequest(
        requestFromExpress(request),
      );
    response.status(tokenResponse.status);
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
