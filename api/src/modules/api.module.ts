import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { LeaderboardsService } from '../services/leaderboards.service';

@Module({
  imports: [],
  providers: [UsersService, LeaderboardsService],
  exports: [UsersService, LeaderboardsService],
})
export class APIModule {}
