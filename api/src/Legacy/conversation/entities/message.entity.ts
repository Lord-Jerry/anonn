import { Exclude, Transform } from 'class-transformer';

export class MessageEntity {
  @Exclude()
  pId: string;
  @Transform(({ obj }) =>
    typeof obj.conversationId === 'string' ? obj.conversationId : Exclude(),
  )
  conversationId: number | string;
  @Exclude()
  senderId: number;

  @Transform(({ obj }) => obj.pId)
  id: string | number;
  conversationPId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  isMine: boolean;

  constructor(partial: Partial<MessageEntity>) {
    Object.assign(this, partial);
  }
}
