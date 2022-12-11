import { JwtModule } from '@nestjs/jwt';
import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy } from './strategies';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, AtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
