import dayjs from 'dayjs';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {IMessage} from '../types/message';
import {formatMessageGroupDate} from './time';

export const generateMessageId = () => uuidv4();

export const groupMessagesByDate = (messages: IMessage[], lastReadAt?: Date) => {
  const groupedMessages = new Map<string, IMessage[]>();

  messages.forEach(message => {
    const isNewMessage = message.isNewMessage && lastReadAt && dayjs(message.createdAt).isAfter(dayjs(lastReadAt));
    const messageLabel = isNewMessage ? 'New Messages' : formatMessageGroupDate(message.createdAt);

    if (!groupedMessages.has(messageLabel)) {
      groupedMessages.set(messageLabel, []);
    }
    groupedMessages.get(messageLabel)!.push(message);
  });

  const result: (IMessage | string)[] = [];
  groupedMessages.forEach((messages, label) => {
    result.push(...messages, label);
  });

  return result;
};
