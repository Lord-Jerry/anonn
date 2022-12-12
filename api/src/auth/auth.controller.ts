import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthZeroDto } from "./dto";
import { UserEntity } from "../user/entities";

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('create-account')
  @HttpCode(HttpStatus.CREATED)
	async createAccount(@Body() dto: AuthZeroDto): Promise<UserEntity> {
		const user = await this.authService.createAccount(dto);
		return new UserEntity(user);
	}

	@Post('login')
	async loginAccount(@Body() dto: AuthZeroDto): Promise<UserEntity> {
		const user = await this.authService.loginAccount(dto);
		return new UserEntity(user);
	}
}
