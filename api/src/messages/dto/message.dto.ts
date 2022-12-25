import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class ConversationIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  conversationId: string;
}

export class GetMessagesQueryParamDto {
  @IsOptional()
  @IsDateString()
  cursor?: Date;

  @IsOptional()
  @IsIn(['latest'])
  cursor_type?: 'latest';
}
