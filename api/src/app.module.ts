import { JwtModule } from '@nestjs/jwt';
import { CacheModule, Module } from '@nestjs/common';
import { PrismaModule } from './providers/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigMangerModule, ConfigMangerService } from './common/config';
import { UserModule } from './user/user.module';
import { ConversationModule } from './conversation/conversation.module';
import { PollsModule } from './polls/polls.module';
import { MessagesModule } from './messages/messages.module';

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
  ],
  providers: [ConfigMangerService],
})
export class AppModule {}
