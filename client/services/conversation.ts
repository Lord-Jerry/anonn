import Cookies from "js-cookie";
import { Axios } from "axios";

import { USER_COOKIE_KEYS } from "./auth";

import ApiService from "./api";
export default class ConversationService {
  private api: Axios;

  constructor(token?: string) {
    this.api = ApiService(token || Cookies.get(USER_COOKIE_KEYS.TOKEN));
  }

  async getLastConversationWithUser(userId: string) {
    try {
      const { data } = await this.api.get<{id: string}>(`/conversation/last/${userId}`);
      return data;
    } catch (error) {
      return null;
    }
  }
}
