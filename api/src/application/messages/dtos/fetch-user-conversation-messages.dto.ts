import { IsIn, IsDateString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class FetchUserConversationMessagesQueryParamDto {
  @IsOptional()
  @IsDateString()
  messageCursor?: Date;

  @IsOptional()
  @IsIn(['before', 'after'])
  cursorType?: 'after';
}

export class FetchUserConversationMessagesParamDto {
  @IsUUID()
  @IsNotEmpty()
  conversationPublicId: string;
}
