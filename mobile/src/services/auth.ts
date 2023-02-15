import BaseService from './base';
import AVATARS from '@constant/avatars';

import {storeData, StoreKeys} from './asynstorage';
import {database, Config as ConfigModel} from '@db/index';

type AuthPlatformType = 'google' | 'apple';

export type UserResponse = {
  id: string;
  token: string;
  username: string | null;
  avatar: keyof typeof AVATARS | null;
};

export default class AuthService extends BaseService {
  persistUser = async (user: UserResponse) => {
    user.token && (await storeData(StoreKeys.token, user.token));
    user.username && (await storeData(StoreKeys.username, user.username));
    user.avatar && (await storeData(StoreKeys.avatar, user.avatar));

    const config = await database.collections.get<ConfigModel>('config').query().fetch();
    if (config[0]?.userId !== user.id) {
      await database.write(async () => {
        // incase the user is different, we need to reset the database
        await database.unsafeResetDatabase();

        await database.collections.get<ConfigModel>('config').create(config => {
          config.userId = user.id;
        });
      });
    }
  };

  async authenticate(token: string, platform: AuthPlatformType, name?: string) {
    const {data} = await this.api.post<UserResponse>('/auth', {
      token,
      platform,
      name,
    });

    await this.persistUser(data);

    return data;
  }
}
