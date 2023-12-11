import { Injectable } from '@nestjs/common';
import { CheckUserExistenceService } from './check-user-existence.service';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class DeleteUserAccount {
  constructor(
    private readonly _db: DatabaseService,
    private readonly _checkUserExistenceService: CheckUserExistenceService,
  ) {}

  async deleteUserAccount(userPublicId: string) {
    const user = await this._checkUserExistenceService.findUserByPublicIdOrFail(userPublicId);
    return this._db.users.update({
      where: { id: user.id },
      data: {
        name: 'deleted user',
        email: `${user.email}-deleted`,
        deletedAt: new Date(),
        notification_channels: {
          deleteMany: {},
        },
      },
    });
  }
}
