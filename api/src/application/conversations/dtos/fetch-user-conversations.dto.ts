import { IsIn, IsDateString, IsOptional } from 'class-validator';

export class FetchConversationQueryParamDto {
  @IsOptional()
  @IsDateString()
  conversationCursor?: Date;

  @IsOptional()
  @IsIn(['before', 'after'])
  cursorType?: 'after';
}
