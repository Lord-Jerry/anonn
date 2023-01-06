import { groupBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { Notification_channels } from '@prisma/client';
import * as admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';
import { ConfigMangerService } from 'src/common/config';

import { DatabaseService } from 'src/providers/database/database.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  private firebase: admin.app.App;
  constructor(
    private db: DatabaseService,
    private userService: UserService,
    config: ConfigMangerService,
  ) {
    this.firebase = admin.initializeApp({
      credential: admin.credential.cert(
        config.getFirebaseConfig() as admin.ServiceAccount,
      ),
    });
  }

  async createOrUpdateDeviceToken({
    id,
    userId,
    deviceToken,
    platform,
  }: {
    id?: string;
    userId: string;
    deviceToken: string;
    platform: Notification_channels;
  }) {
    const user = await this.userService.findUserById(userId);

    if (!id) {
      return this.db.notification_channels.create({
        data: {
          userId: user.id,
          token: deviceToken,
          channel: platform,
        },
      });
    }

    return this.db.notification_channels.update({
      where: {
        pId: id,
      },
      data: {
        token: deviceToken,
      },
    });
  }

  async removeDeviceToken(id: string, userId: string) {
    const user = await this.userService.findUserById(userId);
    const notificationChannel = await this.db.notification_channels.findFirst({
      where: {
        pId: id,
        userId: user.id,
      },
      select: {
        pId: true,
      },
    });

    return this.db.notification_channels.delete({
      where: {
        pId: notificationChannel.pId,
      },
    });
  }

  async sendMessageNotification({
    senderId,
    conversationId,
    message,
  }: {
    senderId: number;
    conversationId: string;
    message: string;
  }) {
    try {
      const [conversationParticipants, senderAvatar] = await Promise.all([
        this.db.users_conversations.findMany({
          where: {
            conversations: {
              pId: conversationId,
            },
          },
          select: {
            userId: true,
            conversation_username: true,
          }
        }),
        this.db.users.findFirst({
          where: {
            id: senderId,
          },
          select: {
            avatar: true,
          },
        }),
      ]);

      const { sender, receiver } = groupBy(
        conversationParticipants,
        (participant) =>
          participant.userId === senderId ? 'sender' : 'receiver',
      );

      const notificationChannels = await this.db.notification_channels.findMany(
        {
          where: {
            userId: receiver[0].userId,
          },
          select: {
            token: true,
          },
        },
      );

      if (notificationChannels.length === 0) {
        return;
      }
      const payload = {
        notification: {
          title: sender[0].conversation_username,
          body: message,
        },
        data: {
          conversationId,
          avatar: senderAvatar.avatar,
        },
      };

      await getMessaging(this.firebase).sendToDevice(
        notificationChannels.map((channel) => channel.token),
        payload,
        {
          priority: 'high',
          timeToLive: 60 * 60 * 24,
        },
      );
    } catch (error) {
      console.error("Couldn't send message notification");
      console.error(error);
    }
  }
}
