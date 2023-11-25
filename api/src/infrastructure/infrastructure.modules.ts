import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { ConfigMangerService } from './config/config.service';
import { DatabaseService } from './database/database.service';
import { EncryptionService } from './services/encryption.service';
import { AppleAuthService } from './auth/services/apple.auth.service';
import { GoogleAuthService } from './auth/services/google.auth.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
  ],
  providers: [AppleAuthService, GoogleAuthService, EncryptionService, DatabaseService, ConfigMangerService],
  exports: [AppleAuthService, GoogleAuthService, EncryptionService, DatabaseService, ConfigMangerService],
})
export class InfrastructureModule {}
