import {
	Request,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Body,
	UseGuards,
	Get,
	Param,
	Delete,
	UseInterceptors,
	ClassSerializerInterceptor,
} from "@nestjs/common";

import { PollsService } from "./polls.service";

import { CreatePollDto, PollIdParamDto, VoteDto } from "./dto";
import { AtGuard } from "src/Legacy/auth/guards";
import { IRequestUser } from "src/Legacy/common/types";
import { PollEntity } from "./entities";

@UseGuards(AtGuard)
@Controller('polls')
@UseInterceptors(ClassSerializerInterceptor)
export class PollsController {
	constructor(private pollsService: PollsService) {}

	@Post('create')
  @HttpCode(HttpStatus.CREATED)
	async createPoll(
		@Request() req: IRequestUser,
		@Body() dto: CreatePollDto,
	) {
		const poll = await this.pollsService.createPoll(
			req.user.userId,
			dto.question,
			dto.options,
		);

		return new PollEntity(poll);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getPoll(
		@Param() param: PollIdParamDto,
	) {
		const poll = await this.pollsService.getSinglePoll(param.id);
		return new PollEntity(poll);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async deletePoll(
		@Request() req: IRequestUser,
		@Param() param: PollIdParamDto,
	) {
		await this.pollsService.deletePoll(req.user.userId, param.id);
	}

	@Post(':id/vote')
	@HttpCode(HttpStatus.OK)
	async vote(
		@Request() req: IRequestUser,
		@Param() param: PollIdParamDto,
		@Body() dto: VoteDto,
	) {
		return this.pollsService.voteOnPoll(
			req.user.userId,
			param.id,
			dto.optionId,
		);
	}
}
