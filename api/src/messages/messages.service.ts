import { uniqBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConversationService } from 'src/conversation/conversation.service';
import { DatabaseService } from 'src/providers/database/database.service';

import { markMessageAsBelongsToUser } from '../conversation/utils';

@Injectable()
export class MessagesService {
  constructor(
    private db: DatabaseService,
    private conversationService: ConversationService,
  ) {}

  async sendMessage(userId: string, conversationId: string, content: string) {
    const conversationPermission =
      await this.conversationService.checkConversationPermissions(
        userId,
        conversationId,
      );

    const [message] = await this.db.$transaction(async (tx) => {
      return Promise.all([
        this.db.messages.create({
          data: {
            conversationId: conversationPermission.conversationId,
            senderId: conversationPermission.userId,
            username: conversationPermission.conversation_username,
            content,
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

    const getReadMessages = cursor
      ? () => []
      : () =>
          this.db.messages.findMany({
            take: 10,
            where: {
              id: {
                lte: conversationPermission.lastReadMessageId || undefined,
              },
              conversationId: conversationPermission.conversationId,
            },
          });

    // if request doesn't have cursor, that means its a first request
    // so we need to return 10 read messages, if any with 20 unread messages if any
    const [readMessages, unreadMessages] = await Promise.all([
      getReadMessages(),
      this.db.messages.findMany({
        take: 20,
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
      }),
    ]);

    const messages = uniqBy([...readMessages, ...unreadMessages], 'id');
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

    return messages.map((message) => ({
      ...markMessageAsBelongsToUser(conversationPermission.userId, message),
      // message can be considered read, when:
      // 1. message is older than last read message
      // 2. message is not sent by the user
      isNewMessage:
        message.id > conversationPermission.lastReadMessageId &&
        message.senderId !== conversationPermission.userId,
    }));
  }
}
