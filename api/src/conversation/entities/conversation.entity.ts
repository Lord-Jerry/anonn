import { Exclude, Expose } from 'class-transformer';

export class ConversationEntity {
  title: string;
  isOpen: boolean;
  isGroup: boolean;
  hasNewMessage: boolean;
  conversationId: string;
  conversationUsername: string;
  @Exclude()
  lastMessageIsMine: boolean;

  @Exclude()
  messages?: {
    senderId: number;
    content: string;
    createdAt: Date;
  }[];

  avatar?: string;

  createdAt: Date;
  updatedAt: Date;

  @Expose()
  get lastMessage() {
    return {
      isMine: this.lastMessageIsMine,
      content: this.messages?.[0]?.content,
      sentAt: this.messages?.[0]?.createdAt,
    };
  }

  constructor(partial: Partial<ConversationEntity>) {
    Object.assign(this, partial);
  }
}
