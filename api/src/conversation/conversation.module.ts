import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { UserModule } from 'src/user/user.module';
import { EncryptionModule } from 'src/encryption/encryption.module'
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  imports: [UserModule, EncryptionModule, NotificationModule],
  exports: [ConversationService],
})
export class ConversationModule {}
