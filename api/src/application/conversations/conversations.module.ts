import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { FetchUserConversationsService } from './services/fetch-user-conversations.service';
import { MarkUserConversationAsReadService } from './services/mark-user-conversation-as-read.service';
import { CheckUserConversationPermissionService } from './services/check-user-conversation-permission.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ConversationsController],
  providers: [MarkUserConversationAsReadService, FetchUserConversationsService, CheckUserConversationPermissionService],
  exports: [CheckUserConversationPermissionService],
})
export class ConversationsModule {}
