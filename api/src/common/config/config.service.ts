import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envVars } from '../constants';

type keyUnion = typeof envVars[number];

@Injectable()
export class ConfigMangerService implements OnApplicationBootstrap {
  constructor(private config: ConfigService) {}

  get(key: keyUnion): string {
    return this.config.get(key);
  }

  getFirebaseConfig(): {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
  } {
    return {
      type: this.config.get('FIREBASE_TYPE'),
      project_id: this.config.get('FIREBASE_PROJECT_ID'),
      private_key_id: this.config.get('FIREBASE_PRIVATE_KEY_ID'),
      private_key: Buffer.from(String(this.config.get('FIREBASE_PRIVATE_KEY')), 'base64').toString(),
      client_email: this.config.get('FIREBASE_CLIENT_EMAIL'),
      client_id: this.config.get('FIREBASE_CLIENT_ID'),
      auth_uri: this.config.get('FIREBASE_AUTH_URI'),
      token_uri: this.config.get('FIREBASE_TOKEN_URI'),
      auth_provider_x509_cert_url: this.config.get(
        'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
      ),
      client_x509_cert_url: this.config.get(
        'FIREBASE_CLIENT_X509_CERT_URL',
      ),
    };
  }

  onApplicationBootstrap() {
    for (const key of envVars) {
      if (!this.config.get(key)) {
        throw new Error(`missing ENV variable ${key}`);
      }
    }
  }
}
