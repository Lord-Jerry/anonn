import { JwtModule } from '@nestjs/jwt';
import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy, RtStrategy } from './strategies';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
