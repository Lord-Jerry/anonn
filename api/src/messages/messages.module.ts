import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { UserModule } from 'src/user/user.module';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [UserModule, ConversationModule]
})
export class MessagesModule {}
