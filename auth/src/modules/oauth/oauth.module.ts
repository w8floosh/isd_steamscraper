import { FactoryProvider, Module } from '@nestjs/common';
import { AuthorizationServer, JwtService } from '@jmondi/oauth2-server';
import { AuthcodeService } from '../../services/authcode.service';
import { ClientService } from '../../services/client.service';
import { TokenService } from '../../services/token.service';
import { ScopeService } from 'src/services/scope.service';
import { UserService } from 'src/services/user.service';
import { OAuthController } from './oauth.controller';
import { UserInterceptor } from './interceptors/user.interceptor';
import { RedisModule } from '../redis.module';
import { LoginController } from 'src/login.controller';

const AuthorizationServerFactory: FactoryProvider<AuthorizationServer> = {
  provide: 'AUTH_SERVER',
  useFactory: (
    authCodeRepository: AuthcodeService,
    clientRepository: ClientService,
    tokenRepository: TokenService,
    scopeRepository: ScopeService,
    userRepository: UserService,
  ) => {
    const server = new AuthorizationServer(
      clientRepository,
      tokenRepository,
      scopeRepository,
      new JwtService(process.env.SECRET),
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
    JwtService,
  ],
};

@Module({
  imports: [RedisModule],
  controllers: [OAuthController, LoginController],
  providers: [
    AuthcodeService,
    ClientService,
    TokenService,
    ScopeService,
    UserService,
    {
      provide: JwtService,
      useFactory: () => new JwtService(process.env.JWT_SECRET),
    },
    AuthorizationServerFactory,
    UserInterceptor,
  ],
  exports: [AuthorizationServerFactory],
})
export class OAuthModule {}
