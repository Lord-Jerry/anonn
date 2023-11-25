import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { UserModule } from 'src/Legacy/user/user.module';
import { ConversationModule } from 'src/Legacy/conversation/conversation.module';
import { EncryptionModule } from 'src/Legacy/encryption/encryption.module';
import { NotificationModule } from 'src/Legacy/notification/notification.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    UserModule,
    ConversationModule,
    EncryptionModule,
    NotificationModule,
  ],
})
export class MessagesModule {}
