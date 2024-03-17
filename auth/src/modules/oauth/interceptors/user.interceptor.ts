import { JwtService } from '@jmondi/oauth2-server';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  JWTDecodeException,
  MalformedJIDException,
  UserNotFoundException,
} from 'src/lib/errors';
import { UserService } from 'src/services/user.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const jid = req.cookies?.jid;

    if (!jid) return next.handle();

    let userId: string | undefined;

    try {
      const decoded = await this.jwtService.verify(jid);
      userId = decoded?.userId.toString();
    } catch (e) {
      throw new JWTDecodeException(e.message);
    }

    if (!userId) throw new MalformedJIDException('userId');

    const user = await this.userService.getUserByCredentials(userId);

    if (!user) throw new UserNotFoundException(userId);

    req.user = user;

    next.handle();
  }
}
