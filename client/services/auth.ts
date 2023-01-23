import Cookies from 'js-cookie';
import { Axios } from 'axios';

import ApiService from './api';
import { AVATARS, COOKIE_KEYS } from 'constants/index';

type AuthPlatformType = 'google' | 'apple';
const cookieExpiry = 60 * 60 * 24 * 30; // 30 days

export type UserResponse = {
  id: string;
  token?: string;
  username: string | null;
  avatar: keyof typeof AVATARS | null;
};

export default class AuthService {
  private api: Axios;

  constructor(token?: string) {
    this.api = ApiService(token || Cookies.get(COOKIE_KEYS.TOKEN));
  }

  setTokenToCookie(token: string) {
    Cookies.set(COOKIE_KEYS.TOKEN, token, {
      expires: cookieExpiry,
    });
  }

  setUsernameToCookie(username: string) {
    Cookies.set(COOKIE_KEYS.USERNAME, username, {
      expires: cookieExpiry,
    });
  }

  setAvatarToCookie(avatar: string) {
    Cookies.set(COOKIE_KEYS.AVATAR, avatar, {
      expires: cookieExpiry,
    });
  }

  setDeviceNotificationIdToCookie(deviceId: string) {
    Cookies.set(COOKIE_KEYS.NOTIFICATION_DEVICE_ID, deviceId, {
      expires: cookieExpiry,
    });
  }

  async authenticate(token: string, platform: AuthPlatformType) {
    const { data } = await this.api.post<UserResponse>('/auth', {
      token,
      platform,
    });

    this.logout();
    if (data.token) this.setTokenToCookie(data.token);
    if (data.username) this.setUsernameToCookie(data.username);
    if (data.avatar) this.setAvatarToCookie(data.avatar);

    return data;
  }

  logout() {
    Object.values(COOKIE_KEYS).forEach((key) => Cookies.remove(key));
  }
}
