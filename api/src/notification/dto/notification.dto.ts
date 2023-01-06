import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Notification_channels } from '@prisma/client';

export class UpsertDeviceTokenDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.keys(Notification_channels).map((key) => key.toLowerCase()))
  channel: Lowercase<Notification_channels>;
}

export class RemoveDeviceTokenDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}