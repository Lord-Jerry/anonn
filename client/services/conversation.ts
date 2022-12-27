import Cookies from "js-cookie";
import { Axios } from "axios";

import { USER_COOKIE_KEYS } from "./auth";

import ApiService from "./api";

export type messageData = {
  id: string;
  content: string;
};
export default class ConversationService {
  private api: Axios;

  constructor(token?: string) {
    this.api = ApiService(token || Cookies.get(USER_COOKIE_KEYS.TOKEN));
  }

  async getLastConversationWithUser(userId: string) {
    try {
      const { data } = await this.api.get<{ id: string }>(
        `/conversation/last/${userId}`
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  async getAllConversations(type: string) {
    const { data } = await this.api.get<{ type: string }[]>(
      `/conversation/${type}`
    );
    return data;
  }

  async getSingleConversation(id: string) {
    const { data } = await this.api.get(`/messages/${id}`);
    return data;
  }

  async sendMessage({ id, content }: messageData) {
    const { data } = await this.api.post(`/messages/send/${id}`, {
      content: content,
    });
    return data;
  }
}
