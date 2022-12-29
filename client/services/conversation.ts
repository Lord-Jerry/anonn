import Cookies from "js-cookie";
import { Axios } from "axios";

import { USER_COOKIE_KEYS } from "./auth";

import ApiService from "./api";
import { Message } from "types/message";

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
  status: "PENDING" | "ACTIVE" | "REJECTED";
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

  async getAllConversations(
    type: string,
    cursor?: Date,
    cursorType?: "latest"
  ) {
    try {
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
    } catch (error) {
      return [];
    }
  }

  async getSingleConversation(id: string) {
    try {
      const { data } = await this.api.get<ConversationType>(
        `/conversation/${id}/get`
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  async getConversationMessages(
    conversationId: string,
    cursor?: Date,
    cursorType?: "latest"
  ) {
    try {
      const { data } = await this.api.get<Message[]>(
        `/messages/${conversationId}`,
        {
          params: {
            cursor,
            cursor_type: cursorType,
          },
        }
      );
      return data;
    } catch (error) {
      return [];
    }
  }

  async sendMessage({ id, content }: messageData) {
    try {
      const { data } = await this.api.post(`/messages/send/${id}`, {
        content: content,
      });
      return data;
    } catch (error) {
      return null;
    }
  }

  async startConversation({ id, content }: messageData) {
    try {
      const { data } = await this.api.post(
        `/conversation/init-conversation/${id}`,
        {
          content: content,
        }
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  async updateConversationStatus({
    conversationId,
    action,
  }: {
    conversationId: string;
    action: "approve" | "reject";
  }) {
    try {
      await this.api.put(`/conversation/${conversationId}/${action}`);
    } catch (error) {
      return null;
    }
  }
}
