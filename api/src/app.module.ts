import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: '192.168.56.2',
          port: 6379,
        },
      },
    ]),
  ],
  providers: [AppService],
})
export class AppModule {}
