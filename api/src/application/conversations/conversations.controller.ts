import {
  Put,
  Body,
  Query,
  Request,
  HttpCode,
  Controller,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AtGuard, IRequestUser } from 'src/infrastructure/auth/guards/at.guards';
import { FetchConversationQueryParamDto } from './dtos/fetch-user-conversations.dto';
import { MarkUserConversationAsReadDto } from './dtos/mark-user-conversatiion-as-read.dto';
import { FetchUserConversationsService } from './services/fetch-user-conversations.service';
import { MarkUserConversationAsReadService } from './services/mark-user-conversation-as-read.service';

@UseGuards(AtGuard)
@Controller('conversations')
@UseInterceptors(ClassSerializerInterceptor)
export class ConversationsController {
  constructor(
    private _fetchUserConversationsService: FetchUserConversationsService,
    private _markUserConversationAsReadService: MarkUserConversationAsReadService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAll(@Request() req: IRequestUser, @Query() dto: FetchConversationQueryParamDto) {
    return this._fetchUserConversationsService.fetchUserConversations({ ...dto, userPublicId: req.user.userId });
  }

  @Put('/mark-as-read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Request() req: IRequestUser, @Body() dto: MarkUserConversationAsReadDto) {
    return this._markUserConversationAsReadService.markUserConversationAsRead({
      ...dto,
      userPublicId: req.user.userId,
    });
  }
}
