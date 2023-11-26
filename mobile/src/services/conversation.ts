import {IMessage} from '../types/message';
import BaseService from './base';

export type messageData = {
  id: string;
  content: string;
  conversationId: string;
};

export type ConversationType = {
  avatar: string;
  conversationId: string;
  hasNewMessage: boolean;
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
export default class ConversationService extends BaseService {
  async getLastConversationWithUser(userId: string) {
    try {
      const {data} = await this.api.get<{id: string}>(
        `/conversation/last/${userId}`,
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  async getAllConversations(
    conversationCursor?: Date,
    cursorType?: 'after' | 'before',
  ) {
    try {
      const {data} = await this.api.get<ConversationType[]>(`/conversations`, {
        params: {
          cursorType,
          conversationCursor,
        },
      });
      return data;
    } catch (error) {
      return [];
    }
  }

  async getSingleConversation(id: string) {
    try {
      const {data} = await this.api.get<ConversationType>(
        `/conversation/${id}/get`,
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  async sendMessage({id, content, conversationId}: messageData) {
    try {
      const {data} = await this.api.post(`/messages/send/${conversationId}`, {
        id,
        content,
      });
      return data;
    } catch (error) {
      return null;
    }
  }

  async startConversation({id, content}: messageData) {
    try {
      const {data} = await this.api.post(
        `/conversation/init-conversation/${id}`,
        {
          content: content,
        },
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  async getConversationMessages(
    conversationId: string,
    messageCursor?: Date,
    cursorType?: 'after' | 'before',
  ) {
    try {
      const {data} = await this.api.get<IMessage[]>(
        `/messages/v2/${conversationId}`,
        {
          params: {
            cursorType,
            messageCursor,
          },
        },
      );
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async updateConversationStatus({
    conversationId,
    action,
  }: {
    conversationId: string;
    action: 'approve' | 'reject';
  }) {
    try {
      await this.api.put(`/conversation/${conversationId}/${action}`);
    } catch (error) {
      return null;
    }
  }

  async checkUserHasNewConversation() {
    try {
      const {data} = await this.api.get<{status: 'PENDING' | 'ACTIVE'}[]>(
        '/conversation/has-new',
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  async markConversationAsRead(
    conversationPublicId: string,
    messagePublicId: string,
  ) {
    try {
      await this.api.put(`/conversations/mark-as-read`, {
        messagePublicId,
        conversationPublicId,
      });
    } catch (error) {
      return null;
    }
  }
}
