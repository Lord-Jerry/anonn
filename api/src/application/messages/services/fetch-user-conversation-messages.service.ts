import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { EncryptionService } from 'src/infrastructure/services/encryption.service';
import { CheckUserConversationPermissionService } from 'src/application/conversations/services/check-user-conversation-permission.service';

type Props = {
  userPublicId: string;
  messageCursor?: Date;
  conversationPublicId: string;
  cursorType?: 'before' | 'after';
};

@Injectable()
export class GetUserConversationMessagesService {
  constructor(
    private readonly _db: DatabaseService,
    private readonly _encryptionService: EncryptionService,
    private readonly _checkUserConversationPermissionService: CheckUserConversationPermissionService,
  ) {}

  async fetchUserConversationMessages(props: Props) {
    const conversationDetails =
      await this._checkUserConversationPermissionService.checkIfUserHasAccessToConversationOrFail({
        userPublicId: props.userPublicId,
        conversationPublicId: props.conversationPublicId,
      });

    const messages = await this._getMessages({
      ...props,
      privateConversationId: conversationDetails.conversationPrivateId,
      userConversationLastReadMessageId: conversationDetails.userConversationLastReadMessageId,
    });
    return messages.map((message) => ({
      id: message.pId,
      isNewMessage:
        message.id > conversationDetails.userConversationLastReadMessageId &&
        message.senderId !== conversationDetails.userPrivateId,
      content: this._encryptionService.decryptMessage(
        message.content,
        conversationDetails.conversationEncryptionKey as `${string}-${string}`,
      ),
      isMine: message.senderId === conversationDetails.userPrivateId,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      username: message.username,
    }));
  }

  private async _getMessages(
    props: { privateConversationId: number; userConversationLastReadMessageId: number } & Pick<
      Props,
      'messageCursor' | 'cursorType'
    >,
  ) {
    return this._db.messages.findMany({
      take: 50,
      where: {
        conversationId: props.privateConversationId,
        createdAt:
          props.messageCursor && props.cursorType === 'after'
            ? { gt: props.messageCursor }
            : { lt: props.messageCursor },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
