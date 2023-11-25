import { Injectable } from '@nestjs/common';

import { UserService } from 'src/Legacy/user/user.service';
import { ConversationService } from 'src/Legacy/conversation/conversation.service';
import { DatabaseService } from 'src/Legacy/providers/database/database.service';
import { EncryptionService } from 'src/Legacy/encryption/encryption.service';
import { NotificationService } from 'src/Legacy/notification/notification.service';

import { markMessageAsBelongsToUser } from '../conversation/utils';

interface AllMessages {
  id: string;
  privateId: number;
  senderId: number;
  status: string;
  content: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  description: string;
  isOpen: boolean;
  isGroup: boolean;
  conversationCreatedAt: Date;
  conversationUpdatedAt: Date;
  encryptionKey: string;
  lastReadMessageId: number;
  conversationName: string;
}

type SendMessageProps = {
  id?: string;
  userId: string;
  conversationId: string;
  content: string;
}
@Injectable()
export class MessagesService {
  constructor(
    private db: DatabaseService,
    private userService: UserService,
    private conversationService: ConversationService,
    private encryptionService: EncryptionService,
    private notificationService: NotificationService,
  ) {}

  async sendMessage({id, userId, conversationId, content}: SendMessageProps) {
    const conversationPermission =
      await this.conversationService.checkConversationPermissions(
        userId,
        conversationId,
      );

    const encryptedMessage = conversationPermission.conversationEncryptionKey
      ? this.encryptionService.encryptMessage(
          content,
          conversationPermission.conversationEncryptionKey as `${string}-${string}`,
        )
      : content;

    const [message] = await this.db.$transaction(async (tx) => {
      return Promise.all([
        this.db.messages.create({
          data: {
            pId: id,
            conversationId: conversationPermission.conversationId,
            senderId: conversationPermission.userId,
            username: conversationPermission.conversation_username,
            content: encryptedMessage,
          },
        }),
        tx.users_conversations.updateMany({
          where: {
            conversationId: conversationPermission.conversationId,
            NOT: {
              userId: conversationPermission.userId,
            },
          },
          data: {
            hasNewMessage: true,
            updatedAt: new Date(),
          },
        }),
        tx.users_conversations.updateMany({
          where: {
            conversationId: conversationPermission.conversationId,
            userId: conversationPermission.userId,
          },
          data: {
            updatedAt: new Date(),
          },
        }),
      ]);
    });

    this.notificationService.sendMessageNotification({
      senderId: conversationPermission.userId,
      conversationId,
      message: content,
    });
    message.content = content;

    return {
      ...markMessageAsBelongsToUser(conversationPermission.userId, message),
      username: conversationPermission.conversation_username,
    };
  }

  async getMessages({
    userId,
    conversationId,
    cursor,
    cursorType,
  }: {
    userId: string;
    conversationId: string;
    cursor?: Date;
    cursorType?: 'latest';
  }) {
    const conversationPermission =
      await this.conversationService.checkConversationPermissions(
        userId,
        conversationId,
      );

    // if request doesn't have cursor, that means its a first request
    const messages = await this.db.messages.findMany({
      take: 50,
      where: {
        id: {
          gt: cursor
            ? conversationPermission.lastReadMessageId || undefined
            : undefined,
        },
        conversationId: conversationPermission.conversationId,
        createdAt: cursor
          ? {
              [cursorType === 'latest' ? 'gt' : 'lt']: cursor,
            }
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const latestMessage = messages[0];

    if (conversationPermission.lastReadMessageId < latestMessage?.id) {
      await this.db.users_conversations.update({
        where: {
          id: conversationPermission.conversationPermissionId,
        },
        data: {
          lastReadMessageId: latestMessage?.id,
          hasNewMessage: false,
        },
      });
    }

    return messages.map((message) => {
      const decryptedMessage = this.encryptionService.decryptMessage(
        message.content,
        conversationPermission.conversationEncryptionKey as `${string}-${string}`,
      );
      return {
        ...markMessageAsBelongsToUser(conversationPermission.userId, message),
        content: decryptedMessage,
        // message can be considered read, when:
        // 1. message is older than last read message
        // 2. message is not sent by the user
        isNewMessage:
          message.id > conversationPermission.lastReadMessageId &&
          message.senderId !== conversationPermission.userId,
      };
    });
  }

  async getMessagesForMobileApp(userId: string, cursor?: Date) {
    const user = await this.userService.findUserById(userId);
    const messages = await this.db.$queryRaw <AllMessages[]>`
      SELECT
        c."isOpen",
	      c."isGroup",
	      m.content,
        uc.status,
	      m.username,
	      c.description,
	      m."pId" AS id,
	      m."senderId",
	      m."createdAt",
	      m."updatedAt",
	      m.id AS "privateId",
        uc. "lastReadMessageId",
	      c.key AS "encryptionKey",
	      c. "pId" AS "conversationId",
	      uc.title AS "conversationName",
	      c. "createdAt" AS "conversationCreatedAt",
	      c. "updatedAt" AS "conversationUpdatedAt"
      FROM messages m
	    JOIN conversations c ON m."conversationId" = c.id
	    JOIN users_conversations uc ON uc."conversationId" = c.id
      WHERE uc. "userId" = ${user.id} AND m."createdAt" > ${cursor || '2022-01-01'}::timestamp
      LIMIT 100;
    `;

    return messages.map((message) => {
      const decryptedMessage = this.encryptionService.decryptMessage(
        message.content,
        message.encryptionKey as `${string}-${string}`,
      );
      return {
        ...message,
        content: decryptedMessage,
        isMine: user.id === message.senderId,
        // message can be considered read, when:
        // 1. message is older than last read message
        // 2. message is not sent by the user
        isNewMessage:
          message.privateId > message.lastReadMessageId &&
          message.senderId !== user.id,
      };
    });
  }
}
