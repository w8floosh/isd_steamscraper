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
import type { Request, Response } from 'express';
import { UserInterceptor } from './interceptors/user.interceptor';
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
  @UseInterceptors(UserInterceptor)
  async authorizeRequest(
    @Req() request: Request & { user: User },
    @Res() response: Response,
  ): Promise<void> {
    const authRequest =
      await this.authorizationServer.validateAuthorizationRequest(request);

    const user = request.user;
    authRequest.user = user;

    authRequest.isAuthorizationApproved =
      !!authRequest.user &&
      (await this.clientService.isClientValid(
        'authorization_code',
        authRequest.client,
      ));

    const oauthResponse =
      await this.authorizationServer.completeAuthorizationRequest(authRequest);
    return handleExpressResponse(response, oauthResponse);
  }
}
