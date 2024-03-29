import nextCookies from 'next-cookies';
import Cookies from 'js-cookie';
import { Axios } from 'axios';

import ApiService from './api';
import AuthService, { UserResponse } from './auth';
import { AVATARS, COOKIE_KEYS } from 'constants/index';
import { GetServerSidePropsContext } from 'next';

type AvatarsType = {
  key: string;
  avatar: string;
};

export default class ProfileService {
  private api: Axios;
  private authService: AuthService;

  constructor(token?: string) {
    this.api = ApiService(token || Cookies.get(COOKIE_KEYS.TOKEN));
    this.authService = new AuthService(token);
  }

  async checkUsernameAvailability(username: string) {
    const { data } = await this.api.get<any>(
      '/user/check-username-availability',
      {
        params: { username },
      }
    );
    return data;
  }

  async setUsername(username: string) {
    await this.api.put<UserResponse>('/user/set-username', {
      username,
    });
    this.authService.setUsernameToCookie(username);
    return true;
  }

  async getAvatars() {
    const { data } = await this.api.get<AvatarsType[]>(
      '/user/platform-avatars'
    );
    return data;
  }

  async setAvatar(avatarId: string) {
    await this.api.put('/user/set-avatar', {
      avatarId,
    });
    this.authService.setAvatarToCookie(avatarId);
    return true;
  }

  async findUserByUsername(username: string) {
    try {
      const { data } = await this.api.get<UserResponse>(`/user/${username}`);
      return { ...data, avatar: AVATARS[data.avatar as keyof typeof AVATARS] };
    } catch (error) {
      console.log({ error });
      return null;
    }
  }

  async setReferer(username: string) {
    await this.api.put('/user/set-referrer', {
      username,
    });
    return true;
  }

  async upsertUserDeviceToken(token: string, id?: string) {
    const { data } = await this.api.post<{ id: string }>(
      '/notification/upsert-device-token',
      {
        id,
        token,
        channel: 'web',
      }
    );

    return data.id;
  }

  async removeUserDeviceToken(id: string) {
    await this.api.delete('/notification/remove-device-token', {
      params: { id },
    });
  }

  validateUserProfile(ctx: GetServerSidePropsContext) {
    const cookie = nextCookies(ctx);
    let redirectionDestination = '';
    const isUserLoggedIn = cookie[COOKIE_KEYS.TOKEN];
    const username = cookie[COOKIE_KEYS.USERNAME];
    const isAvatarSet = cookie[COOKIE_KEYS.AVATAR] as keyof typeof AVATARS;
    const notificationEnabled = cookie[COOKIE_KEYS.NOTIFICATION_DEVICE_ID] || null;

    if (!isUserLoggedIn) {
      redirectionDestination = '/';
      Object.values(COOKIE_KEYS).forEach((key) =>
        ctx.res?.setHeader(
          'Set-Cookie',
          `${key}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
        )
      );
    } else if (!username) redirectionDestination = '/profile/set-username';
    else if (!isAvatarSet) redirectionDestination = '/profile/set-avatar';

    return {
      redirectionDestination,
      token: isUserLoggedIn,
      username,
      avatar: AVATARS[isAvatarSet],
      notificationEnabled,
    };
  }
}
