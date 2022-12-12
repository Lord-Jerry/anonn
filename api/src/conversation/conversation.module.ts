import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  imports: [UserModule],
})
export class ConversationModule {}
