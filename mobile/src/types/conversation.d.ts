export type IConversation = {
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
