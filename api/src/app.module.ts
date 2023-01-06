import { JwtModule } from '@nestjs/jwt';
import { CacheModule, Module } from '@nestjs/common';
import { PrismaModule } from './providers/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigMangerModule, ConfigMangerService } from './common/config';
import { UserModule } from './user/user.module';
import { ConversationModule } from './conversation/conversation.module';
import { PollsModule } from './polls/polls.module';
import { MessagesModule } from './messages/messages.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { EncryptionModule } from './encryption/encryption.module';
import { EncryptMessages } from './commands/encyrpt-messages';
import { NotificationModule } from './notification/notification.module';

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
    ConversationModule,
    PollsModule,
    MessagesModule,
    EncryptionModule,
    NotificationModule,
  ],
  providers: [ConfigMangerService, EncryptMessages],
  controllers: [HealthCheckController],
})
export class AppModule {}
