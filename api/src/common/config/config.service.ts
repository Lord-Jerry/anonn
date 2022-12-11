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

  onApplicationBootstrap() {
    for (const key of envVars) {
      if (!this.config.get(key)) {
        throw new Error(`missing ENV variable ${key}`);
      }
    }
  }
}
