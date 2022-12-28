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
  ApproveRejectConversationRequestDto,
  ConversationIdParamDto,
  ConversationTypeDto,
  FetchConversationQueryParamDto,
  GroupConversationDto,
  LastConversationDto,
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
  @Get('/:conversationId/get')
  @HttpCode(HttpStatus.OK)
  async getConversation(
    @Request() req: IRequestUser,
    @Param() param: ConversationIdParamDto,
  ) {
    const conversation = await this.conversationService.getSingleConversation(
      req.user.userId,
      param.conversationId,
    );

    return new ConversationEntity(conversation);
  }

  @UseGuards(AtGuard)
  @Get('/:type')
  @HttpCode(HttpStatus.OK)
  async getPendingConversations(
    @Param() params: ConversationTypeDto,
    @Request() req: IRequestUser,
    @Query() query: FetchConversationQueryParamDto,
  ) {
    const conversationType =
      params.type.toUpperCase() as User_conversation_status;
    const conversations =
      await this.conversationService.getConversationsByStatus({
        userId: req.user.userId,
        status: conversationType,
        cursor: query.cursor,
        cursorType: query.cursor_type,
      });

    return conversations.map(
      (conversation) => new ConversationEntity(conversation),
    );
  }

  @UseGuards(AtGuard)
  @Put('/:conversationId/:action')
  @HttpCode(HttpStatus.OK)
  async approveRejectConversationRequest(
    @Param() params: ApproveRejectConversationRequestDto,
    @Request() req: IRequestUser,
  ) {
    const actionMapper = {
      approve: User_conversation_status.ACTIVE,
      reject: User_conversation_status.REJECTED,
    };

    await this.conversationService.approveRejectConversationRequest(
      req.user.userId,
      params.conversationId,
      actionMapper[params.action],
    );
  }

  @UseGuards(AtGuard)
  @Get('/last/:userId')
  @HttpCode(HttpStatus.OK)
  async getLastConversationWithUser(
    @Param() params: LastConversationDto,
    @Request() req: IRequestUser,
  ) {
    const { conversations } =
      (await this.conversationService.getLastConversationWithUser(
        req.user.userId,
        params.userId,
      )) || {};

    return {
      id: conversations?.pId,
    };
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
