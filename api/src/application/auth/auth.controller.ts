import {
  Body,
  Post,
  HttpCode,
  Controller,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthenticateDto } from './dtos/authenticate.dto';
import { AuthenticateService } from './services/authenticate.service';

@Controller('authenticate')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private _authenticateService: AuthenticateService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() dto: AuthenticateDto) {
    return this._authenticateService.authenticate(dto);
  }
}
