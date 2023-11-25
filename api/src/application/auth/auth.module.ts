import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthenticateService } from './services/authenticate.service';
import { CheckUserExistenceService } from './services/check-user-existence.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  exports: [CheckUserExistenceService],
  providers: [AuthenticateService, CheckUserExistenceService],
})
export class AuthModule {}
