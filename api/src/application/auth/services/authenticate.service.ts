import { omit } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigMangerService } from 'src/infrastructure/config/config.service';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { AUTH_PROVIDERS, ENVIRONMENTAL_VARIABLES } from 'src/infrastructure/constants';
import { AppleAuthService } from 'src/infrastructure/auth/services/apple.auth.service';
import { GoogleAuthService } from 'src/infrastructure/auth/services/google.auth.service';

type Payload = {
  token: string;
  provider: string;
  platform: string;
};

@Injectable()
export class AuthenticateService {
  constructor(
    private readonly _jwt: JwtService,
    private readonly _db: DatabaseService,
    private readonly _config: ConfigMangerService,
    private readonly _appleAuthService: AppleAuthService,
    private readonly _googleAuthService: GoogleAuthService,
  ) {}

  async authenticate(payload: Payload) {
    const user = await this._validate0AuthToken(payload);
    if (!user) throw new UnauthorizedException('Invalid token');

    let findUserEmail = await this._findUserByEmail(user.email);
    if (!findUserEmail) findUserEmail = await this._createUser(user);

    const token = await this._generateToken(findUserEmail.pId);
    return {
      token,
      ...omit(findUserEmail, 'id', 'name', 'referrerId'),
    };
  }

  async _validate0AuthToken(payload: Payload) {
    if (payload.provider === AUTH_PROVIDERS.GOOGLE) {
      return this._googleAuthService.validateToken(payload.token, payload.platform);
    } else if (payload.provider === AUTH_PROVIDERS.APPLE) {
      return this._appleAuthService.validateToken(payload.token);
    }
  }

  async _findUserByEmail(email: string) {
    return this._db.users.findUnique({ where: { email } });
  }

  async _createUser(user: { name: string; email: string; provider: string; providerId: string }) {
    return this._db.users.create({ data: user });
  }

  async _generateToken(userId: string) {
    const secret = this._config.get(ENVIRONMENTAL_VARIABLES.AT_SECRET);
    return this._jwt.signAsync({ userId }, { secret, expiresIn: '10y' });
  }
}
