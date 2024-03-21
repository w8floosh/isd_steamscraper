import { Module } from '@nestjs/common';
import { OAuthModule } from './modules/oauth/oauth.module';

@Module({
  imports: [OAuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
