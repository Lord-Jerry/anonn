import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigMangerService } from 'src/Legacy/common/config';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access-token') {
  constructor(config: ConfigMangerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('AT_SECRET'),
    });
  }

  validate<T>(payload: T) {
    return payload;
  }
}
