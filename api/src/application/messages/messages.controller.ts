import {
  Body,
  Request,
  HttpCode,
  Controller,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AtGuard, IRequestUser } from 'src/infrastructure/auth/guards/at.guards';
import { GetUserConversationMessagesService } from './services/fetch-user-conversation-messages.service';
import {
  FetchUserConversationMessagesParamDto,
  FetchUserConversationMessagesQueryParamDto,
} from './dtos/fetch-user-conversation-messages.dto';

@UseGuards(AtGuard)
@Controller('messages/v2')
@UseInterceptors(ClassSerializerInterceptor)
export class MessagesController {
  constructor(private _getUserConversationMessagesService: GetUserConversationMessagesService) {}

  @Get('/:conversationPublicId')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Request() req: IRequestUser,
    @Param() param: FetchUserConversationMessagesParamDto,
    @Body() dto: FetchUserConversationMessagesQueryParamDto,
  ) {
    return this._getUserConversationMessagesService.fetchUserConversationMessages({
      ...dto,
      userPublicId: req.user.userId,
      conversationPublicId: param.conversationPublicId,
    });
  }
}
