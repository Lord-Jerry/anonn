import { IsNotEmpty, IsString, IsUUID} from 'class-validator';

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