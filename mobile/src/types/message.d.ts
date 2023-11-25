export type IMessage = {
  id: string;
  content: string;
  updatedAt: Date;
  createdAt: Date;
  isMine: boolean;
  username: string;
  isNewMessage: boolean;
};
