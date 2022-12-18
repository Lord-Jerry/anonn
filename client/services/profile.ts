import Cookies from "js-cookie";
import { Axios } from "axios";

import ApiService from "./api";
import { USER_COOKIE_KEYS, UserResponse } from "./auth";

type AvatarsType = {
  key: string;
  avatar: string;
};

export default class ProfileService {
  private api: Axios;

  constructor(token?: string) {
    this.api = ApiService(token || Cookies.get(USER_COOKIE_KEYS.TOKEN));
  }

  async checkUsernameAvailability(username: string) {
    const { data } = await this.api.get<boolean>(
      "/user/check-username-availability",
      {
        params: { username },
      }
    );
    return data;
  }

  async setUsername(username: string) {
    const { data } = await this.api.put<UserResponse>("/user/set-username", {
      username,
    });
    if (data.username) Cookies.set(USER_COOKIE_KEYS.USERNAME, data.username);
    return true;
  }

  async getAvatars() {
    const { data } = await this.api.get<AvatarsType[]>(
      "/user/platform-avatars"
    );
    return data;
  }

  async setAvatar(avatarId: string) {
    const { data } = await this.api.put("/user/set-avatar", {
      avatarId,
    });
    Cookies.set(USER_COOKIE_KEYS.AVATAR, avatarId);
    return true;
  }
}
