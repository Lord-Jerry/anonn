import { Exclude, Expose, Transform } from 'class-transformer';
import { AVATARS } from 'src/common/constants';

export class ConversationEntity {
  title: string;
  isOpen: boolean;
  isGroup: boolean;
  hasNewMessage: boolean;
  conversationId: string;
  @Exclude()
  conversationUsername: string;
  @Exclude()
  lastMessageIsMine: boolean;

  @Exclude()
  messages?: {
    senderId: number;
    content: string;
    createdAt: Date;
  }[];

  @Transform(({ obj }) => AVATARS[obj.avatar])
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
