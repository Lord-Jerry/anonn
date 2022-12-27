import { Exclude, Transform } from 'class-transformer';

export class MessageEntity {
  @Exclude()
  pId: string;
  @Exclude()
  conversationId: number;
  @Exclude()
  senderId: number;

  @Transform(({ obj }) => obj.pId)
  id: string | number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  isMine: boolean;
  isNewMessage: boolean;

  constructor(partial: Partial<MessageEntity>) {
    Object.assign(this, partial);
  }
}
