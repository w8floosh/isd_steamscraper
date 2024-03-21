import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

abstract class TokenError extends Error {}

export class PersistenceException extends InternalServerErrorException {
  constructor(entity: string) {
    super(`Failed to persist ${entity}`);
  }
}

export class RedisException extends InternalServerErrorException {
  constructor(message: string) {
    super(`Could not connect to Redis: ${message}`);
  }
}

export class InvalidAuthcodeException extends UnauthorizedException {
  constructor() {
    super('Invalid authcode');
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Invalid credentials');
  }
}

export class MalformedJIDException extends InternalServerErrorException {
  constructor(property: string) {
    super('Malformed JID cookie: ', property);
  }
}
export class JWTDecodeException extends InternalServerErrorException {
  constructor(message: string) {
    super('Could not decode JWT: ', message);
  }
}

export class TokenRevocationError extends TokenError {
  constructor() {
    super(`Failed to revoke token`);
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(user: string) {
    super(`User not found: ${user}`);
  }
}

export class ScopeNotFoundException extends NotFoundException {
  constructor(...scopes: string[]) {
    super(`Specified scopes not found: ${scopes}`);
  }
}

export class AuthcodeNotFoundException extends NotFoundException {
  constructor() {
    super(`Authcode not found`);
  }
}
