import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Request,
	UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AtGuard } from "src/auth/guards";
import { IRequestUser } from "src/common/types";

import { ConversationService } from "./conversation.service";
import { ConversationIdParamDto, SendMessageDto, UserIdParamDto } from "./dto";
import { ConversationEntity, MessageEntity } from "./entities/";

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
		const message = await this.conversationService.initConversation(
			req.user.userId,
			param.userId,
			dto.content,
		);

    return new MessageEntity(message)
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
  @Get(':conversationId')
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
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getConversations(
    @Request() req: IRequestUser,
    @Query() query: { cursor: string },
  ) {
    const conversations = await this.conversationService.getConversations(req.user.userId, query.cursor);
    return conversations.map((conversation) => new ConversationEntity(conversation));
  }
}
