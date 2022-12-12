import { Exclude, Transform } from 'class-transformer';

export class ConversationEntity {
  @Exclude()
  pId: string;
  @Exclude()
  creatorId: number;
  @Exclude()
  messages: unknown[];

  @Transform(({ obj }) => obj.pId)
  id: string | number;
  isOpen: Boolean;
  isGroup: Boolean;
  username?: string;
  message?: {
    content: string;
    isMine: boolean;
  }
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ConversationEntity>) {
    Object.assign(this, partial);
  }
}
