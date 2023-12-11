import {
  Put,
  Body,
  Post,
  Request,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthenticateDto } from './dtos/authenticate.dto';
import { LogoutService } from './services/logout.service';
import { AuthenticateService } from './services/authenticate.service';
import { DeleteUserAccount } from './services/delete-user-account.service';
import { AtGuard, IRequestUser } from 'src/infrastructure/auth/guards/at.guards';

@Controller('authenticate')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly _logoutService: LogoutService,
    private readonly _deleteUserAccount: DeleteUserAccount,
    private readonly _authenticateService: AuthenticateService,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() dto: AuthenticateDto) {
    return this._authenticateService.authenticate(dto);
  }

  @Put('/delete-account')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async deleteUserAccount(@Request() req: IRequestUser) {
    await this._deleteUserAccount.deleteUserAccount(req.user.userId);
  }

  @Put('/logout')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: IRequestUser, @Body() dto: { notificationChannelId?: string }) {
    await this._logoutService.logout({
      userPublicId: req.user.userId,
      notificationChannelId: dto.notificationChannelId,
    });
  }
}
