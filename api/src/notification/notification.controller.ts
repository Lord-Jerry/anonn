import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { IRequestUser } from 'src/common/types';
import { RemoveDeviceTokenDto, UpsertDeviceTokenDto } from './dto/notification.dto';
import { Notification_channels } from '@prisma/client';
import { AtGuard } from 'src/auth/guards';

@UseGuards(AtGuard)
@Controller('notification')
@UseInterceptors(ClassSerializerInterceptor)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('upsert-device-token')
  async createOrUpdateDeviceToken(
    @Request() req: IRequestUser,
    @Body() dto: UpsertDeviceTokenDto,
  ) {
    const notification =
      await this.notificationService.createOrUpdateDeviceToken({
        id: dto.id,
        userId: req.user.userId,
        deviceToken: dto.token,
        platform: dto.channel.toUpperCase() as Notification_channels,
      });

    return {
      id: notification.pId,
    };
  }

  @Delete('remove-device-token')
  async removeDeviceToken(
    @Request() req: IRequestUser,
    @Query() dto: RemoveDeviceTokenDto,
  ) {
    await this.notificationService.removeDeviceToken(dto.id, req.user.userId);
  }
}
