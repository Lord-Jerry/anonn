import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';

@Module({
  controllers: [PollsController],
  providers: [PollsService],
  imports: [UserModule]
})
export class PollsModule {}
