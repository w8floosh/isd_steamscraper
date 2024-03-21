import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorizationServer } from '@jmondi/oauth2-server';
import { handleExpressResponse } from '@jmondi/oauth2-server/express';
import { Request, Response } from 'express';
import { UserMiddleware } from './interceptors/user.interceptor';
import { User } from './entities';
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
  ): Promise<Record<string, any>> {
    const tokenResponse =
      await this.authorizationServer.respondToAccessTokenRequest(request);
    response.status(tokenResponse.status);
    return tokenResponse.body;
  }

  @Get('authorize')
  @UseInterceptors(UserMiddleware)
  async authorizeRequest(
    @Req() request: Request & { user: User },
    @Res() response: Response,
  ): Promise<void> {
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

    return handleExpressResponse(response, oauthResponse);
  }
}
