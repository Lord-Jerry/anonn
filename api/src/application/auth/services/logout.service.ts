import { Injectable } from '@nestjs/common';
import { CheckUserExistenceService } from './check-user-existence.service';
import { DatabaseService } from 'src/infrastructure/database/database.service';

type Props = {
  userPublicId: string;
  notificationChannelId?: string;
};

@Injectable()
export class LogoutService {
  constructor(
    private readonly _db: DatabaseService,
    private readonly _checkUserExistenceService: CheckUserExistenceService,
  ) {}

  async logout(props: Props) {
    const user = await this._checkUserExistenceService.findUserByPublicIdOrFail(props.userPublicId);
    return this._db.notification_channels.deleteMany({
      where: {
        userId: user.id,
        pId: props.notificationChannelId,
      },
    });
  }
}
