import {
  FactoryProvider,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthorizationServer, JwtService } from '@jmondi/oauth2-server';
import { AuthcodeService } from '../../services/authcode.service';
import { ClientService } from '../../services/client.service';
import { TokenService } from '../../services/token.service';
import { ScopeService } from 'src/services/scope.service';
import { UserService } from 'src/services/user.service';
import { OAuthController } from './oauth.controller';
import { UserMiddleware } from './interceptors/user.interceptor';
import { RedisModule } from '../redis/redis.module';
import { LoginController } from 'src/login.controller';

const AuthorizationServerFactory: FactoryProvider<AuthorizationServer> = {
  provide: 'AUTH_SERVER',
  useFactory: (
    authCodeRepository: AuthcodeService,
    clientRepository: ClientService,
    tokenRepository: TokenService,
    scopeRepository: ScopeService,
    userRepository: UserService,
    jwtService: JwtService,
  ) => {
    const server = new AuthorizationServer(
      clientRepository,
      tokenRepository,
      scopeRepository,
      jwtService,
    );
    server.enableGrantType({
      grant: 'authorization_code',
      userRepository,
      authCodeRepository,
    });
    return server;
  },
  inject: [
    AuthcodeService,
    ClientService,
    TokenService,
    ScopeService,
    UserService,
    JwtService,
  ],
};

@Module({
  imports: [RedisModule],
  controllers: [OAuthController, LoginController],
  providers: [
    Logger,
    AuthcodeService,
    ClientService,
    TokenService,
    ScopeService,
    UserService,
    AuthorizationServerFactory,
    {
      provide: JwtService,
      useFactory: () => new JwtService('your-secret-here'),
    },
  ],
  exports: [AuthorizationServerFactory],
})
export class OAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes(
        { path: 'oauth/token', method: RequestMethod.POST },
        { path: 'oauth/authorize', method: RequestMethod.GET },
      );
  }
}
