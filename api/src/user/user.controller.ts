import {
	Get,
	Post,
	Body,
	Put,
	Param,
	Controller,
	HttpCode,
	HttpStatus,
	Request,
	UseGuards,
	UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";

import { UserNameDto } from "./dto";
import { UserEntity } from "./entities";
import { AtGuard } from "../auth/guards";
import { UserService } from "./user.service";


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

	@Get(':username')
	@HttpCode(HttpStatus.OK)
	async findUserByUsername(@Param() dto: UserNameDto) {
		const user = await this.userService.findUserByUsername(dto.username);
		return new UserEntity(user);
	}
}
