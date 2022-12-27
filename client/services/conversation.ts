import Cookies from 'js-cookie';
import { Axios } from 'axios';

import { USER_COOKIE_KEYS } from './auth';

import ApiService from './api';

export type messageData = {
  id: string;
  content: string;
};

export type ConversationType = {
  avatar: string;
  conversationId: string;
  hasNewMessages: boolean;
  isGroup: boolean;
  isOpen: boolean;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  title: string;
  updatedAt: Date;
  lastMessage: {
    content: string;
    isMine: boolean;
    sentAt: Date;
  };
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

  async getAllConversations(type: string, cursor?: Date, cursorType?: 'latest' ) {
    const { data } = await this.api.get<ConversationType[]>(
      `/conversation/${type}`,
      {
        params: {
          cursor,
          cursor_type: cursorType,
        },
      }
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
