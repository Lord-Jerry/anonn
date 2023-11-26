import BaseService from './base';
import {storeData, StoreKeys} from './asynstorage';

import AVATARS from 'constant/avatars';
import {Platform} from 'react-native';

export default class UserService extends BaseService {
  async checkUsernameAvailability(username: string) {
    try {
      const {data} = await this.api.get<boolean>(
        '/user/check-username-availability',
        {
          params: {username},
        },
      );

      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async setUsername(username: string) {
    try {
      await this.api.put('/user/set-username', {
        username,
      });
      await storeData(StoreKeys.username, username);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async setAvatar(avatarId: keyof typeof AVATARS) {
    try {
      await this.api.put('/user/set-avatar', {
        avatarId,
      });
      await storeData(StoreKeys.avatar, avatarId);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async upsertUserDeviceToken(token: string, id?: string) {
    const {data} = await this.api.post<{id: string}>(
      '/notification/upsert-device-token',
      {
        id,
        token,
        channel: 'mobile',
        // channel: Platform.OS.toUpperCase(),
      },
    );

    return data.id;
  }
}
