import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MessagesController } from './messages.controller';
import { ConversationsModule } from '../conversations/conversations.module';
import { GetUserConversationMessagesService } from './services/fetch-user-conversation-messages.service';

@Module({
  imports: [AuthModule, ConversationsModule],
  controllers: [MessagesController],
  providers: [GetUserConversationMessagesService],
})
export class MessagesModule {}
