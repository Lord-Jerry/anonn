import { JwtModule } from '@nestjs/jwt';
import { CacheModule, Module } from '@nestjs/common';
import { PrismaModule } from './providers/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigMangerModule, ConfigMangerService } from './common/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigMangerModule,
    PrismaModule,
    AuthModule,
    CacheModule.register({
      isGlobal: true,
    }),
    JwtModule.register({}),
    UserModule,
  ],
  providers: [ConfigMangerService],
})
export class AppModule {}
