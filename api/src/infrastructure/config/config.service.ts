import { ConfigService } from '@nestjs/config';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ENVIRONMENTAL_VARIABLES } from '../constants';

type keyUnion = keyof typeof ENVIRONMENTAL_VARIABLES;

@Injectable()
export class ConfigMangerService implements OnApplicationBootstrap {
  constructor(private config: ConfigService) {}

  get(key: keyUnion): string {
    return this.config.get(key);
  }

  getFirebaseConfig() {
    return {
      type: this.config.get(ENVIRONMENTAL_VARIABLES.FIREBASE_TYPE) as string,
      project_id: this.config.get(
        ENVIRONMENTAL_VARIABLES.FIREBASE_PROJECT_ID,
      ) as string,
      private_key_id: this.config.get(
        ENVIRONMENTAL_VARIABLES.FIREBASE_PRIVATE_KEY_ID,
      ) as string,
      private_key: Buffer.from(
        String(this.config.get(ENVIRONMENTAL_VARIABLES.FIREBASE_PRIVATE_KEY)),
        'base64',
      ).toString(),
      client_email: this.config.get(
        ENVIRONMENTAL_VARIABLES.FIREBASE_CLIENT_EMAIL,
      ) as string,
      client_id: this.config.get(
        ENVIRONMENTAL_VARIABLES.FIREBASE_CLIENT_ID,
      ) as string,
      auth_uri: this.config.get(
        ENVIRONMENTAL_VARIABLES.FIREBASE_AUTH_URI,
      ) as string,
      token_uri: this.config.get(
        ENVIRONMENTAL_VARIABLES.FIREBASE_TOKEN_URI,
      ) as string,
      auth_provider_x509_cert_url: this.config.get(
        ENVIRONMENTAL_VARIABLES.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      ) as string,
      client_x509_cert_url: this.config.get(
        ENVIRONMENTAL_VARIABLES.FIREBASE_CLIENT_X509_CERT_URL,
      ) as string,
    };
  }

  onApplicationBootstrap() {
    for (const key of Object.values(ENVIRONMENTAL_VARIABLES)) {
      if (!this.config.get(key)) {
        throw new Error(`missing ENV variable ${key}`);
      }
    }
  }
}
