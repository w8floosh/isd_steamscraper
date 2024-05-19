import { JwtService } from '@jmondi/oauth2-server';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JWTDecodeException, MalformedJIDException } from 'src/lib/errors';
import { User } from '../../entities';
import { IUserData } from 'src/entities/user';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  private readonly logger = new Logger(UserMiddleware.name);
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const jid = req.cookies?.jid;

    if (!jid) return next();

    let user: User;

    try {
      const decoded = await this.jwtService.verify(jid);
      user = User.create(decoded.user as IUserData, 'summary');
    } catch (e) {
      this.logger.error(e.message + ' for user ' + user.email);
      throw new JWTDecodeException(e.message);
    }
    if (!user) {
      this.logger.error('Malformed JID');
      throw new MalformedJIDException('user');
    }

    req['user'] = user;
    return next();
  }
}
