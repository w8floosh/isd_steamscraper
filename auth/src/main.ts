import { NestFactory } from '@nestjs/core';
import { OAuthModule } from './modules/oauth/oauth.module';

async function bootstrap() {
  const app = await NestFactory.create(OAuthModule);
  await app.listen(3000);
}
bootstrap();
