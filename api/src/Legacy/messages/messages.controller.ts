import {
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  Param,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AtGuard } from 'src/Legacy/auth/guards';
import { IRequestUser } from 'src/Legacy/common/types';
import {
  ConversationIdParamDto,
  GetMessagesQueryParamDto,
  SendMessageDto,
} from './dto';
import { MessageEntity, MobileAppMessageEntity } from './entities';

@Controller('messages')
@UseInterceptors(ClassSerializerInterceptor)
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @UseGuards(AtGuard)
  @Post('send/:conversationId')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Request() req: IRequestUser,
    @Param() param: ConversationIdParamDto,
    @Body() dto: SendMessageDto,
  ) {
    const message = await this.messageService.sendMessage({
      id: dto.id,
      content: dto.content,
      userId: req.user.userId,
      conversationId: param.conversationId,
  });

    return new MessageEntity(message);
  }

  @UseGuards(AtGuard)
  @Get('/get')
  @HttpCode(HttpStatus.OK)
  async getMessagesForMobileApp(
    @Request() req: IRequestUser,
    @Query() query: GetMessagesQueryParamDto,
  ) {
    const messages = await this.messageService.getMessagesForMobileApp(
      req.user.userId,
      query.cursor,
    );
    return messages.map((message) => new MobileAppMessageEntity(message));
  }

  @UseGuards(AtGuard)
  @Get(':conversationId')
  @HttpCode(HttpStatus.OK)
  async getMessages(
    @Request() req: IRequestUser,
    @Param() param: ConversationIdParamDto,
    @Query() query: GetMessagesQueryParamDto,
  ) {
    const messages = await this.messageService.getMessages({
      userId: req.user.userId,
      conversationId: param.conversationId,
      cursor: query.cursor,
      cursorType: query.cursor_type,
    });

    return messages.map((message) => new MessageEntity(message));
  }
}
