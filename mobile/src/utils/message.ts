import {groupBy} from 'lodash';
import {Q} from '@nozbe/watermelondb';

import {database, Messages} from '@db/index';

import {MessageResponse} from '@interfaces/messages';

const findMessages = async (messageIds: string[]) =>
  database.collections
    .get<Messages>('messages')
    .query(Q.where('id', Q.oneOf(messageIds)))
    .fetch();

const insertMessage = async (messages: MessageResponse[] = []) =>
  messages.map(newMessage =>
    database.collections.get<Messages>('messages').prepareCreate(message => {
      message._raw.id = newMessage.id;
      message.conversationId = newMessage.conversationId;
      message.message = newMessage.content;
      message.username = newMessage.username;
      message.isMine = newMessage.isMine;
      message.updatedAt = newMessage.updatedAt;
    }),
  );

const updateMessage = async (messages: MessageResponse[] = []) => {
  const existingMessages = await findMessages(
    messages.map(message => message.id),
  );

  for (const message of existingMessages) {
    const messageResponse = messages.find(
      messageResponse => messageResponse.id === message.id,
    );
    if (!messageResponse) return;

    await message.update(() => {
      message.conversationId = messageResponse.conversationId;
      message.message = messageResponse.content;
      message.username = messageResponse.username;
      message.isMine = messageResponse.isMine;
      message.updatedAt = messageResponse.updatedAt;
    });
  }
};

export const upsertMessage = async (messages: MessageResponse[]) => {
  const existingMessages = await findMessages(
    messages.map(message => message.id),
  );

  const {latest, existing} = groupBy(messages, message =>
    existingMessages.find(existingMessage => existingMessage.id === message.id)
      ? 'existing'
      : 'latest',
  );

  const newMessagesToInsert = await insertMessage(latest);
  const existingMessagesToUpdate = await updateMessage(existing);

  return database.batch(...newMessagesToInsert, existingMessagesToUpdate);
};
