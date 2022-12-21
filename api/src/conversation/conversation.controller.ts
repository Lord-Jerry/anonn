import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AtGuard } from 'src/auth/guards';
import { IRequestUser } from 'src/common/types';

import { ConversationService } from './conversation.service';
import {
  ConversationIdParamDto,
  ConversationTypeDto,
  GroupConversationDto,
  SendMessageDto,
  UserIdParamDto,
} from './dto';
import { ConversationEntity, MessageEntity } from './entities/';
import { User_conversation_status } from '@prisma/client';

@Controller('conversation')
@UseInterceptors(ClassSerializerInterceptor)
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @UseGuards(AtGuard)
  @Post('init-conversation/:userId')
  @HttpCode(HttpStatus.CREATED)
  async initConversation(
    @Request() req: IRequestUser,
    @Param() param: UserIdParamDto,
    @Body() dto: SendMessageDto,
  ) {
    const message = await this.conversationService.initPrivateConversation(
      req.user.userId,
      param.userId,
      dto.content,
    );

    return new MessageEntity(message);
  }

  @UseGuards(AtGuard)
  @Get('/:type')
  @HttpCode(HttpStatus.OK)
  async getPendingConversations(
    @Param() params: ConversationTypeDto,
    @Request() req: IRequestUser,
    @Query() query: { cursor: string },
  ) {
    const conversationType =
      params.type.toUpperCase() as User_conversation_status;
    const conversations =
      await this.conversationService.getConversationsByStatus({
        userId: req.user.userId,
        status: conversationType,
        cursor: query.cursor,
      });

    return conversations.map(
      (conversation) => new ConversationEntity(conversation),
    );
  }

  @UseGuards(AtGuard)
  @Post('send-message/:conversationId')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Request() req: IRequestUser,
    @Param() param: ConversationIdParamDto,
    @Body() dto: SendMessageDto,
  ) {
    return this.conversationService.sendMessage(
      req.user.userId,
      param.conversationId,
      dto.content,
    );
  }

  @UseGuards(AtGuard)
  @Get(':conversationId/messages')
  @HttpCode(HttpStatus.OK)
  async getMessages(
    @Request() req: IRequestUser,
    @Param() param: ConversationIdParamDto,
    @Query() query: { cursor: string },
  ) {
    const messages = await this.conversationService.getConversationMessages(
      req.user.userId,
      param.conversationId,
      query.cursor,
    );

    return messages.map((message) => new MessageEntity(message));
  }

  @UseGuards(AtGuard)
  @Post('init-group-conversation')
  @HttpCode(HttpStatus.CREATED)
  async initGroupConversation(
    @Request() req: IRequestUser,
    @Body() dto: GroupConversationDto,
  ) {
    const conversation = await this.conversationService.initGroupConversation(
      req.user.userId,
      dto.name,
      dto.description,
    );

    return new ConversationEntity(conversation);
  }

  @UseGuards(AtGuard)
  @Post('join-group/:conversationId')
  @HttpCode(HttpStatus.CREATED)
  async joinGroupConversation(
    @Request() req: IRequestUser,
    @Param() param: ConversationIdParamDto,
  ) {
    await this.conversationService.joinGroupConversation(
      req.user.userId,
      param.conversationId,
    );
  }

  @UseGuards(AtGuard)
  @Put('leave-group/:conversationId')
  @HttpCode(HttpStatus.CREATED)
  async leaveGroupConversation(
    @Request() req: IRequestUser,
    @Param() param: ConversationIdParamDto,
  ) {
    await this.conversationService.leaveGroupConversation(
      req.user.userId,
      param.conversationId,
    );
  }
}
