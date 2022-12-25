import { User_conversation_status } from '@prisma/client';
import { IsDate, IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UserIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class ConversationIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  conversationId: string;
}

export class GroupConversationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class ConversationTypeDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.keys(User_conversation_status).map((key) => key.toLowerCase()))
  type: Lowercase<User_conversation_status>;
}

export class FetchConversationQueryParamDto {
  @IsOptional()
  @IsDateString()
  cursor?: Date;

  @IsOptional()
  @IsIn(['latest'])
  cursor_type?: 'latest';
}

export class LastConversationDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}