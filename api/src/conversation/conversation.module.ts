import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { UserModule } from 'src/user/user.module';
import { EncryptionModule } from 'src/encryption/encryption.module'

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  imports: [UserModule, EncryptionModule],
  exports: [ConversationService],
})
export class ConversationModule {}
