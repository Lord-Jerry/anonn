import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigMangerService } from './config.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [ConfigMangerService],
  exports: [ConfigMangerService],
})
export class ConfigMangerModule {}
