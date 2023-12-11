import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class CheckUserExistenceService {
  constructor(private readonly _db: DatabaseService) {}

  async findUserByPublicIdOrFail(userPublicId: string) {
    const user = await this._db.users.findFirst({
      where: {
        pId: userPublicId,
      },
    });

    if (!user || user.deletedAt) throw new UnauthorizedException('User does not exist');

    return user;
  }
}
