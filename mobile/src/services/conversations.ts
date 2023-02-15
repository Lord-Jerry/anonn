import BaseService from './base';

export type MessageResponse = {
  id: string;
  content: string;
  username: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  description: string;
  isOpen: boolean;
  isGroup: boolean;
  conversationCreatedAt: Date;
  conversationUpdatedAt: Date;
  conversationName: string;
  isMine: boolean;
  isNewMessage: boolean;
};

export default class ConversationsService extends BaseService {
  fetchMessages = async (cursor?: Date | string) => {
    try {
      const {data} = await this.api.get<MessageResponse[]>('/messages/get', {
        params: {cursor},
      });
      return data;
    } catch (error) {
      return [];
    }
  };
}
