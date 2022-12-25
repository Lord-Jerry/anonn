import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { DatabaseService } from 'src/providers/database/database.service';
import { UserService } from 'src/user/user.service';
import { markMessageAsBelongsToUser } from './utils';
import { User_conversation_status } from '@prisma/client';

@Injectable()
export class ConversationService {
  constructor(private db: DatabaseService, private userService: UserService) {}

  async checkConversationPermissions(
    userId: string,
    conversationId: string,
    supressError = false,
  ) {
    const { users, status, conversations, conversation_username } =
      (await this.db.users_conversations.findFirst({
        where: {
          conversations: {
            pId: conversationId,
          },
          users: {
            pId: userId,
          },
        },
        select: {
          users: true,
          status: true,
          conversations: true,
          conversation_username: true,
        },
      })) || {};

    if (supressError && !conversations?.id) {
      return null;
    }

    if (!(conversations?.id && conversations.isOpen)) {
      throw new ForbiddenException('conversation not found or already closed');
    }

    return {
      status,
      conversationId: conversations.id,
      userId: users.id,
      conversation_username,
      isGroup: conversations.isGroup,
    };
  }
  async initPrivateConversation(
    initiatorId: string,
    participantId: string,
    content: string,
  ) {
    const [conversationInitiator, conversationParticipant] = await Promise.all([
      this.userService.findUserById(initiatorId),
      this.userService.findUserById(participantId),
    ]);

    const message = await this.db.$transaction(async (tx) => {
      const conversation = await tx.conversations.create({
        data: {
          creatorId: conversationInitiator.id,
        },
      });

      /**
       *  Create permissions for both users in the conversation
       *  random username was genrated for the conversation starter for anonymity
       * the conversation  on participant shared his profile for engagement
       * anyone starting a conversation with the participant wants to be anonymous
       *
       */
      const randomUsername = this.userService.generateRandomUsername();
      await tx.users_conversations.createMany({
        data: [
          {
            conversationId: conversation.id,
            userId: conversationInitiator.id,
            conversation_username: randomUsername,
            title: conversationParticipant.username,
          },
          {
            hasNewMessage: true,
            title: randomUsername,
            conversationId: conversation.id,
            userId: conversationParticipant.id,
            status: User_conversation_status.PENDING,
            conversation_username: conversationParticipant.username,
          },
        ],
      });

      return tx.messages.create({
        data: {
          conversationId: conversation.id,
          senderId: conversationInitiator.id,
          content,
          /**
           * prisma/schema.prisma
           * check message table schema,
           * for more details as to why the username is denormalized
           */
          username: randomUsername,
        },
      });
    });
    return markMessageAsBelongsToUser(conversationInitiator.id, message);
  }

  async approveRejectConversationRequest(
    userId,
    conversationId,
    status: User_conversation_status,
  ) {
    const [user, users_conversation] = await Promise.all([
      this.userService.findUserById(userId),
      this.checkConversationPermissions(userId, conversationId),
    ]);

    if (users_conversation.status !== User_conversation_status.PENDING) {
      throw new BadRequestException(
        'conversation request already approved or rejected',
      );
    }

    return this.db.users_conversations.updateMany({
      where: {
        conversationId: users_conversation.conversationId,
        userId: user.id,
      },
      data: {
        status: User_conversation_status[status],
      },
    });
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    const conversationPermission = await this.checkConversationPermissions(
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
          },
        }),
      ]);
    });

    return {
      ...markMessageAsBelongsToUser(conversationPermission.userId, message),
      username: conversationPermission.conversation_username,
    };
  }

  async getConversationsByStatus({
    userId,
    cursor,
    status,
    cursorType
  }: {
    userId: string;
    cursor?: Date;
    status: User_conversation_status;
    cursorType?: 'latest'
  }) {
    const user = await this.userService.findUserById(userId);
    const conversations = await this.db.users_conversations.findMany({
      take: 20,
      orderBy: [
        {
          hasNewMessage: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
      where: {
        userId: user.id,
        status,
        updatedAt: cursor ? {
          [cursorType === 'latest' ? 'gt' : 'lt']: cursor
        } : undefined
      },
      select: {
        title: true,
        hasNewMessage: true,
        conversation_username: true,
        conversations: {
          select: {
            id: true,
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

    return conversations.map((conversation) => ({
      isOpen: conversation.conversations.isOpen,
      hasNewMessage: conversation.hasNewMessage,
      isGroup: conversation.conversations.isGroup,
      messages: conversation.conversations.messages,
      conversationId: conversation.conversations.pId,
      conversationUsername: conversation.conversation_username,
      lastMessageIsMine:
        conversation.conversations.messages[0]?.senderId === user.id,
      title: conversation.conversations.isGroup
        ? conversation.conversations.name
        : conversation.title,
    }));
  }

  async getConversationMessages(
    userId: string,
    conversationId: string,
    cursor?: string,
  ) {
    const conversationPermission = await this.checkConversationPermissions(
      userId,
      conversationId,
    );
    const messages = await this.db.messages.findMany({
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { pId: cursor } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        conversationId: conversationPermission.conversationId,
      },
    });

    return messages.map((message) =>
      markMessageAsBelongsToUser(conversationPermission.userId, message),
    );
  }

  async initGroupConversation(
    userId: string,
    name: string,
    description: string,
  ) {
    const user = await this.userService.findUserById(userId);
    if (!user.username) {
      throw new BadRequestException(
        'User must have a username to create a group',
      );
    }

    return this.db.$transaction(async (tx) => {
      const conversation = await tx.conversations.create({
        data: {
          name,
          description,
          isGroup: true,
          creatorId: user.id,
        },
      });

      await tx.users_conversations.create({
        data: {
          conversationId: conversation.id,
          userId: user.id,
          title: user.username,
          conversation_username: '',
        },
      });

      return conversation;
    });
  }

  async joinGroupConversation(userId: string, conversationId: string) {
    const [user, conversation, conversationPermission] = await Promise.all([
      this.userService.findUserById(userId),
      this.db.conversations.findUnique({
        where: {
          pId: conversationId,
        },
      }),
      this.checkConversationPermissions(userId, conversationId, true),
    ]);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.isGroup) {
      throw new BadRequestException('Conversation is not a group');
    }

    if (conversationPermission?.userId) {
      throw new BadRequestException('User is already in the conversation');
    }

    return this.db.users_conversations.create({
      data: {
        conversationId: conversation.id,
        userId: user.id,
        title: this.userService.generateRandomUsername(),
        conversation_username: '',
      },
    });
  }

  async leaveGroupConversation(userId: string, conversationId: string) {
    const [user, conversationPermission] = await Promise.all([
      this.userService.findUserById(userId),
      this.checkConversationPermissions(userId, conversationId),
    ]);

    if (!conversationPermission.isGroup) {
      throw new BadRequestException('Conversation is not a group');
    }

    return this.db.users_conversations.deleteMany({
      where: {
        conversationId: conversationPermission.conversationId,
        userId: user.id,
      },
    });
  }
}
