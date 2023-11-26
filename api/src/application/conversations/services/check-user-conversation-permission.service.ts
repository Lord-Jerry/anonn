import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';

type Props = {
  userPublicId: string;
  conversationPublicId: string;
};

@Injectable()
export class CheckUserConversationPermissionService {
  constructor(private readonly _db: DatabaseService) {}

  async checkIfUserHasAccessToConversation(props: Props) {
    const userConversation = await this._findUserConversation(props);
    if (!userConversation?.conversations.id) return null;

    return {
      userPrivateId: userConversation.users.id,
      userPublicId: userConversation.users.pId,
      userConversationPrivateId: userConversation.id,
      userConversationStatus: userConversation.status,
      conversationPublicId: userConversation.conversations.pId,
      conversationPrivateId: userConversation.conversations.id,
      userConversationLastUpdatedAt: userConversation.updatedAt,
      isGroupConversation: userConversation.conversations.isGroup,
      conversationEncryptionKey: userConversation.conversations.key,
      userConversationUsername: userConversation.conversation_username,
      userConversationLastReadMessageId: userConversation.lastReadMessageId,
    };
  }

  async checkIfUserHasAccessToConversationOrFail(props: Props) {
    const conversationDetails = await this.checkIfUserHasAccessToConversation(props);
    if (!conversationDetails) throw new ForbiddenException('You do not have access to this conversation');

    return conversationDetails;
  }

  private async _findUserConversation(props: Props) {
    return this._db.users_conversations.findFirst({
      select: {
        id: true,
        users: true,
        status: true,
        updatedAt: true,
        conversations: true,
        lastReadMessageId: true,
        conversation_username: true,
      },
      where: {
        users: {
          pId: props.userPublicId,
        },
        conversations: {
          pId: props.conversationPublicId,
        },
      },
    });
  }
}
