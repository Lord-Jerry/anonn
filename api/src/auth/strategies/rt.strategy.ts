import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { cacheKeys } from 'src/common/constants';
import { ConfigMangerService } from 'src/common/config/';

@Injectable()
export class RtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    config: ConfigMangerService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate<T>(req: FastifyRequest, payload: Record<string, string>) {
    const refreshToken = req.headers.authorization
      ?.replace('Bearer', '')
      ?.trim();
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const { userId } = payload;
    const cacheKey = `${userId}_${cacheKeys.REFRESH_TOKEN}`;
    const userRefreshToken = await this.cacheService.get(cacheKey);

    if (userRefreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }
    return {
      ...payload,
      refreshToken,
    };
  }
}
