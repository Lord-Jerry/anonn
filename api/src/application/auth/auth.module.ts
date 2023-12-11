import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LogoutService } from './services/logout.service';
import { AuthenticateService } from './services/authenticate.service';
import { DeleteUserAccount } from './services/delete-user-account.service';
import { CheckUserExistenceService } from './services/check-user-existence.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  exports: [CheckUserExistenceService],
  providers: [LogoutService, AuthenticateService, DeleteUserAccount, CheckUserExistenceService],
})
export class AuthModule {}
