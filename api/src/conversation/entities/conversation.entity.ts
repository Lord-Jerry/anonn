import { Exclude, Transform } from 'class-transformer';

export class ConversationEntity {
  @Exclude()
  pId: string;
  @Exclude()
  creatorId: number;
  @Exclude()
  messages: unknown[];
  @Exclude()
  username: string;

  @Transform(({ obj }) => obj.pId)
  id: string | number;
  isOpen: Boolean;
  isGroup: Boolean;
  message?: {
    content: string;
    isMine: boolean;
  }
  @Transform(({ obj }) => obj.isGroup ? obj.name : obj.username)
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ConversationEntity>) {
    Object.assign(this, partial);
  }
}
