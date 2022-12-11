import {
	Post,
	Body,
	Put,
	Controller,
	HttpCode,
	HttpStatus,
	Request,
	UseGuards,
	UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";

import { AtGuard } from "../auth/guards";
import { UserService } from "./user.service";

import { UserNameDto } from "./dto";
import { IRequestUser } from "src/common/types";

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
	constructor(private userService: UserService) {}

	@UseGuards(AtGuard)
	@Post('check-username-availability')
	@HttpCode(HttpStatus.OK)
	async checkUsernameAvailability(@Body() dto: UserNameDto) {
		return this.userService.checkUsernameAvailability(dto.username);
	}

	@UseGuards(AtGuard)
	@Put('set-username')
	@HttpCode(HttpStatus.OK)
	async setUsername(@Request() req: IRequestUser, @Body() dto: UserNameDto) {
		await this.userService.setUsername(req.user.userId, dto.username);
	}
}
