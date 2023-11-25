import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { ConfigMangerService } from './config/config.service';
import { DatabaseService } from './database/database.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
  ],
  providers: [DatabaseService, ConfigMangerService],
  exports: [DatabaseService, ConfigMangerService],
})
export class InfrastructureModule {}
