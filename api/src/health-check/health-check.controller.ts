import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { DatabaseService } from 'src/providers/database/database.service';

@Controller('health-check')
export class HealthCheckController {
  constructor(private db: DatabaseService) {}

  @Get('/')
	@HttpCode(HttpStatus.OK)
	async Check() {
		await this.db.$executeRaw `SELECT 1`
	}
}
