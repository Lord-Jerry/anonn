import dayjs from 'dayjs';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {IMessage} from '../types/message';
import {formatMessageGroupDate} from './time';

export const generateMessageId = () => uuidv4();

export const groupMessagesByDate = (messages: IMessage[], lastReadAt?: Date) => {
  const groupedMessages = new Map<string, IMessage[]>();

  messages.forEach(message => {
    if (message.isNewMessage && dayjs(message.createdAt).isAfter(new Date(lastReadAt!))) {
      const messageLabel = 'New Messages';
      const group = groupedMessages.get(messageLabel) || [];
      group.push(message);
      groupedMessages.set(messageLabel, group);
    } else {
      const messageDate = formatMessageGroupDate(message.createdAt);
      const group = groupedMessages.get(messageDate) || [];

      group.push(message);
      groupedMessages.set(messageDate, group);
    }
  });

  return Array.from(groupedMessages, ([title, data]) => ({title, data}));
};
