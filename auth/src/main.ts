import { NestFactory } from '@nestjs/core';
import { OAuthModule } from './modules/oauth/oauth.module';
import { readFileSync } from 'fs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('src/secrets/server_key.key'),
    cert: readFileSync('src/secrets/server_cert.crt'),
  };
  const app = await NestFactory.create(OAuthModule, { httpsOptions });
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'https://steamscraper:9000',
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
