import { Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from 'src/infrastructure/database/database.service';
import { CheckUserConversationPermissionService } from './check-user-conversation-permission.service';

type Props = {
  userPublicId: string;
  messagePublicId: string;
  conversationPublicId: string;
};

@Injectable()
export class MarkUserConversationAsReadService {
  constructor(
    private readonly _db: DatabaseService,
    private readonly _checkUserConversationPermissionService: CheckUserConversationPermissionService,
  ) {}

  async markUserConversationAsRead(props: Props) {
    const [conversationDetails, message] = await Promise.all([
      this._checkUserConversationPermissionService.checkIfUserHasAccessToConversationOrFail({
        userPublicId: props.userPublicId,
        conversationPublicId: props.conversationPublicId,
      }),
      this._findMessageByPublicId(props.messagePublicId),
    ]);

    if (message.conversationId !== conversationDetails.conversationPrivateId)
      throw new NotFoundException('Message not found');

    if (message.id <= conversationDetails.userConversationLastReadMessageId) return;

    await this._db.users_conversations.update({
      where: {
        id: conversationDetails.userConversationPrivateId,
      },
      data: {
        hasNewMessage: false,
        lastReadMessageId: conversationDetails.conversationPrivateId,
      },
    });
  }

  private async _findMessageByPublicId(messagePublicId: string) {
    const message = await this._db.messages.findFirst({
      where: {
        pId: messagePublicId,
      },
    });

    if (!message) throw new NotFoundException('Message not found');

    return message;
  }
}
