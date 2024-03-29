import {
  FactoryProvider,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AuthorizationServer, JwtService } from '@jmondi/oauth2-server';
import { AuthcodeService } from '../services/authcode.service';
import { ClientService } from '../services/client.service';
import { TokenService } from '../services/token.service';
import { ScopeService } from 'src/services/scope.service';
import { UserService } from 'src/services/user.service';
import { OAuthController } from '../controllers/oauth.controller';
import { UserMiddleware } from '../controllers/interceptors/user.middleware';
import { RedisModule } from './redis.module';
import { LoginController } from 'src/controllers/login.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from 'src/lib/configuration';

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
      {
        requiresS256: false,
      },
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
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [OAuthController, LoginController],
  providers: [
    ConfigService,
    Logger,
    AuthcodeService,
    ClientService,
    TokenService,
    ScopeService,
    UserService,
    AuthorizationServerFactory,
    {
      provide: JwtService,
      useValue: new JwtService('your-secret-here'),
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
        { path: 'login/verify', method: RequestMethod.GET },
      );
  }
}
