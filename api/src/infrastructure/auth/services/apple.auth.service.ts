import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import AppleSigninAuth from 'apple-signin-auth';
import { ConfigMangerService } from 'src/infrastructure/config/config.service';
import { AUTH_PROVIDERS, ENVIRONMENTAL_VARIABLES } from 'src/infrastructure/constants';

@Injectable()
export class AppleAuthService {
  constructor(private config: ConfigMangerService) {}
  async validateToken(token: string) {
    const nonce = this.config.get(ENVIRONMENTAL_VARIABLES.APPLE_NONCE);
    const appleIdTokenClaims = await AppleSigninAuth.verifyIdToken(token, {
      audience: this.config.get(ENVIRONMENTAL_VARIABLES.APPLE_AUDIENCE_IDS).split(','),
      nonce: crypto.createHash('sha256').update(nonce).digest('hex'),
    });

    return {
      name: 'Apple User',
      provider: AUTH_PROVIDERS.APPLE,
      email: appleIdTokenClaims.email,
      providerId: appleIdTokenClaims.sub,
    };
  }
}
