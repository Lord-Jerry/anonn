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
