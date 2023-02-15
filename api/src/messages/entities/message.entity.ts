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

export class MobileAppMessageEntity {
  id: string;
  @Exclude()
  privateId: number;
  content: string;
  username: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  description: string;
  isOpen: boolean;
  isGroup: boolean;
  conversationCreatedAt: Date;
  conversationUpdatedAt: Date;
  @Exclude()
  encryptionKey: string;
  @Exclude()
  lastReadMessageId: number;
  conversationName: string;
  isMine: boolean;
  isNewMessage: boolean;

  constructor(partial: MobileAppMessageEntity) {
    Object.assign(this, partial);
  }
}
