import {groupBy} from 'lodash';
import {Q} from '@nozbe/watermelondb';

import {database, Conversations} from '@db/index';

import {MessageResponse} from '@interfaces/messages';

const findConversations = async (conversationIds: string[]) =>
  database.collections
    .get<Conversations>('conversations')
    .query(Q.where('id', Q.oneOf(conversationIds)))
    .fetch();

const insertConversation = async (conversations: MessageResponse[] = []) =>
  conversations.map(conversationMessage =>
    database.collections
      .get<Conversations>('conversations')
      .prepareCreate(conversation => {
        conversation._raw.id = conversationMessage.conversationId;
        conversation.name = conversationMessage.conversationName;
        conversation.description = conversationMessage.description;
        conversation.status = conversationMessage.status;
        // conversation.avatar = conversationMessage.avatar;
        conversation.isGroup = conversationMessage.isGroup;
        conversation.isOpen = conversationMessage.isOpen;
        conversation.createdAt = conversationMessage.conversationCreatedAt;
        conversation.updatedAt = conversationMessage.conversationUpdatedAt;

        return conversation;
      }),
  );

const updateConversation = async (conversations: MessageResponse[] = []) => {
  const existingConversations = await findConversations(
    conversations.map(conversation => conversation.conversationId),
  );

  for (const conversation of existingConversations) {
    const conversationMessage = conversations.find(
      conversationMessage =>
        conversationMessage.conversationId === conversation.id,
    );
    if (!conversationMessage) return;

    await conversation.update(() => {
      conversation.name = conversationMessage.conversationName;
      conversation.description = conversationMessage.description;
      conversation.status = conversationMessage.status;
      // conversation.avatar = conversationMessage.avatar;
      conversation.isGroup = conversationMessage.isGroup;
      conversation.isOpen = conversationMessage.isOpen;
      conversation.createdAt = conversationMessage.createdAt;
      conversation.updatedAt = conversationMessage.updatedAt;
    });
  }
};

export const upsertConversation = async (conversations: MessageResponse[]) => {
  const existingConversations = await findConversations(
    conversations.map(conversation => conversation.conversationId),
  );

  const {latest, existing} = groupBy(conversations, conversation =>
    existingConversations.find(
      existingConversation =>
        existingConversation.id === conversation.conversationId,
    )
      ? 'existing'
      : 'latest',
  );

  // await database.write(async () => {
    const newConversationsToInsert = await insertConversation(latest);
    const existingConversationsToUpdate = await updateConversation(existing);

    return database.batch(
      ...newConversationsToInsert,
      existingConversationsToUpdate,
    );
  // });
};
