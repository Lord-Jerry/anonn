import {uniqBy} from 'lodash';
import {useEffect} from 'react';

import ConversationsService from '@services/conversations';
import {upsertConversation} from '@utils/conversation';
import {upsertMessage} from '@utils/message';
import {database} from '@db/index';
import {retrieveData, storeData, StoreKeys} from '@services/asynstorage';

const useFetchMessages = () => {
  const conversationsService = new ConversationsService();

  const fetchMessages = async () => {
    const isLoggedIn = await retrieveData(StoreKeys.token);
    if (!isLoggedIn) return;

    const messageLastFetched = await retrieveData(StoreKeys.messageLastFetched);
    const messages = await conversationsService.fetchMessages(messageLastFetched || undefined);
    const groupByConversation = uniqBy(messages, 'conversationId');
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return undefined;

    await storeData(StoreKeys.messageLastFetched, String(lastMessage.updatedAt));
    await database.write(async () => {
      await upsertConversation(groupByConversation);
      await upsertMessage(messages);
    });
  };

  useEffect(() => {
    const id = setInterval(async () => {
      await fetchMessages();
    }, 5000);
    return () => clearInterval(id);
  }, []);
};

export default useFetchMessages;
