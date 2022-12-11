import { JwtModule } from '@nestjs/jwt';
import { CacheModule, Module } from '@nestjs/common';
import { PrismaModule } from './providers/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigMangerModule, ConfigMangerService } from './common/config';

@Module({
  imports: [
    ConfigMangerModule,
    PrismaModule,
    AuthModule,
    CacheModule.register({
      isGlobal: true,
    }),
    JwtModule.register({}),
  ],
  providers: [ConfigMangerService],
})
export class AppModule {}
