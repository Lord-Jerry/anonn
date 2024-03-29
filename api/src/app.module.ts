import { JwtModule } from '@nestjs/jwt';
import { CacheModule, Module } from '@nestjs/common';
import { PrismaModule } from './Legacy/providers/database/database.module';
import { AuthModule } from './Legacy/auth/auth.module';
import { ConfigMangerModule, ConfigMangerService } from './Legacy/common/config';
import { UserModule } from './Legacy/user/user.module';
import { ConversationModule } from './Legacy/conversation/conversation.module';
import { PollsModule } from './Legacy/polls/polls.module';
import { MessagesModule } from './Legacy/messages/messages.module';
import { HealthCheckController } from './Legacy/health-check/health-check.controller';
import { EncryptionModule } from './Legacy/encryption/encryption.module';
import { EncryptMessages } from './Legacy/commands/encyrpt-messages';
import { NotificationModule } from './Legacy/notification/notification.module';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.modules';
import { AuthModule as NewAuthModule } from './application/auth/auth.module';
import { ConversationsModule } from './application/conversations/conversations.module';
import { MessagesModule as NewMessagesModule } from './application/messages/messages.module';

@Module({
  imports: [
    ConfigMangerModule,
    PrismaModule,
    AuthModule,
    CacheModule.register({
      isGlobal: true,
    }),
    JwtModule.register({}),
    UserModule,
    NewAuthModule,
    ConversationModule,
    PollsModule,
    ConversationsModule,
    NewMessagesModule,
    MessagesModule,
    EncryptionModule,
    NotificationModule,
    InfrastructureModule,
  ],
  providers: [ConfigMangerService, EncryptMessages],
  controllers: [HealthCheckController],
})
export class AppModule {}
