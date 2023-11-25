import { IsUUID, IsNotEmpty } from 'class-validator';

export class MarkUserConversationAsReadDto {
  @IsUUID()
  @IsNotEmpty()
  messagePublicId: string;

  @IsUUID()
  @IsNotEmpty()
  conversationPublicId: string;
}
