import {Platform} from 'react-native';
import BaseService from './base';
import AVATARS from 'constant/avatars';

import {storeData, StoreKeys} from './asynstorage';

type AuthProviderType = 'google' | 'apple';

export type UserResponse = {
  id: string;
  token: string;
  username: string | null;
  avatar: keyof typeof AVATARS | null;
};

export default class AuthService extends BaseService {
  persistUser = async (user: UserResponse) => {
    user.id && (await storeData(StoreKeys.id, user.id));
    user.token && (await storeData(StoreKeys.token, user.token));
    user.username && (await storeData(StoreKeys.username, user.username));
    user.avatar && (await storeData(StoreKeys.avatar, user.avatar));
  };

  async authenticate(token: string, provider: AuthProviderType) {
    const {data} = await this.api.post<UserResponse>('/authenticate', {
      token,
      provider,
      platform: Platform.OS.toUpperCase(),
    });

    await this.persistUser(data);

    return data;
  }
}
