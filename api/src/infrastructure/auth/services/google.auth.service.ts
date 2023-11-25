import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigMangerService } from 'src/infrastructure/config/config.service';
import { AUTH_PROVIDERS, ENVIRONMENTAL_VARIABLES } from 'src/infrastructure/constants';

const SUPPORTED_AUDIENCES = {
  WEB: ENVIRONMENTAL_VARIABLES.GOOGLE_WEB_AUDIENCE_ID,
  IOS: ENVIRONMENTAL_VARIABLES.GOOGLE_IOS_AUDIENCE_ID,
  ANDROID: ENVIRONMENTAL_VARIABLES.GOOGLE_ANDROID_AUDIENCE_ID,
};

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;
  constructor(private config: ConfigMangerService) {
    this.client = new OAuth2Client(this.config.get(ENVIRONMENTAL_VARIABLES.GOOGLE_CLIENT_ID));
  }

  async validateToken(token: string, audience: string = 'WEB') {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.config.get(SUPPORTED_AUDIENCES[audience]),
    });

    const payload = ticket.getPayload();
    return {
      name: payload.name,
      email: payload.email,
      providerId: payload.sub,
      provider: AUTH_PROVIDERS.GOOGLE,
    };
  }
}
