import { Injectable } from '@nestjs/common';
import { User_conversation_status } from '@prisma/client';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { EncryptionService } from 'src/infrastructure/services/encryption.service';
import { CheckUserExistenceService } from 'src/application/auth/services/check-user-existence.service';

type Props = {
  userPublicId: string;
  conversationCursor?: Date;
  cursorType?: 'before' | 'after';
};

@Injectable()
export class FetchUserConversationsService {
  constructor(
    private readonly _db: DatabaseService,
    private readonly _encryptionService: EncryptionService,
    private readonly _checkUserExistenceService: CheckUserExistenceService,
  ) {}

  async fetchUserConversations(props: Props) {
    const user = await this._checkUserExistenceService.findUserByPublicIdOrFail(props.userPublicId);
    const userConversations = await this._getAllUserConversations(user.id, props);
    const conversationPrivateIds = userConversations.map((userConversation) => userConversation.conversations.id);
    const conversationParticipants = await this._getConversationParticipants(user.id, conversationPrivateIds);
    return userConversations.map((userConversation) => ({
      status: userConversation.status,
      isOpen: userConversation.conversations.isOpen,
      hasNewMessage: userConversation.hasNewMessage,
      isGroup: userConversation.conversations.isGroup,
      conversationId: userConversation.conversations.pId,
      conversationUsername: userConversation.conversation_username,
      updatedAt: userConversation.updatedAt,
      title: userConversation.conversations.isGroup ? userConversation.conversations.name : userConversation.title,
      avatar: conversationParticipants.find((convo) => convo.conversationId === userConversation.conversations.id)
        ?.users.avatar,
      lastMessage: {
        content:  this._encryptionService.decryptMessage(
          userConversation.conversations.messages[0]?.content,
          userConversation.conversations.key as `${string}-${string}`,
        ),
        sentAt: userConversation.conversations.messages[0]?.createdAt,
        isMine: userConversation.conversations.messages[0]?.senderId === user.id,
      }
    }));
  }

  private async _getAllUserConversations(userPrivateId: number, props: Props) {
    return this._db.users_conversations.findMany({
      take: 50,
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
      where: {
        userId: userPrivateId,
        status: {
          not: User_conversation_status.REJECTED,
        },
        updatedAt:
          props.conversationCursor && props.cursorType === 'after'
            ? { gt: props.conversationCursor }
            : { lt: props.conversationCursor },
      },
      select: {
        title: true,
        hasNewMessage: true,
        conversation_username: true,
        status: true,
        updatedAt: true,
        conversations: {
          select: {
            id: true,
            key: true,
            pId: true,
            isOpen: true,
            isGroup: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            messages: {
              take: 1,
              orderBy: {
                createdAt: 'desc',
              },
              select: {
                content: true,
                senderId: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }

  private async _getConversationParticipants(userPrivateId: number, conversationPrivateIds: number[]) {
    return this._db.users_conversations.findMany({
      where: {
        conversationId: {
          in: conversationPrivateIds,
        },
        userId: {
          not: userPrivateId,
        },
      },
      select: {
        users: true,
        conversationId: true,
      },
    });
  }
}
