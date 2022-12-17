import Cookies from "js-cookie";
import { Axios } from "axios";

import ApiService from "./api";

type AuthPlatformType = "google" | "apple";
export const USER_COOKIE_KEYS = {
  TOKEN: "VVNFUl9DT09LSUVfS0VZUy5UT0tFTg",
  USERNAME: "VVNFUl9DT09LSUVfS0VZUy5JU19VU0VSTkFNRV9TRVQ",
  AVATAR: "VVNFUl9DT09LSUVfS0VZUy5JU19BVkFUQVJfU0VU",
} as const;

export type UserResponse = {
  id: string;
  token?: string;
  username: string | null;
  avatar: null;
};

export default class AuthService {
  private api: Axios;

  constructor(token?: string) {
    this.api = ApiService(token || Cookies.get(USER_COOKIE_KEYS.TOKEN));
  }

  async authenticate(
    token: string,
    platform: AuthPlatformType,
    isRegistration: boolean = false
  ) {
    const { data } = await this.api.post<UserResponse>("/auth", {
      token,
      platform,
    });

    const cookieExpiry = 60 * 60 * 24 * 30; // 30 days
    if (data.token)
      Cookies.set(USER_COOKIE_KEYS.TOKEN, data.token, {
        expires: cookieExpiry,
      });
    if (data.username) Cookies.set(USER_COOKIE_KEYS.USERNAME, data.username);
    if (data.avatar) Cookies.set(USER_COOKIE_KEYS.AVATAR, data.avatar);
    return data;
  }
}
