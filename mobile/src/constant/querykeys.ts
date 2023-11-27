export const getConversationsQueryKey = () => ['conversations'];
export const getMessagesQueryKey = (conversationId: string) => ['messages-active', conversationId];

export const getConversationsMetaDataQueryKey = () => ['conversations-meta-data'];
export const getMessageMetaDataQueryKey = (conversationId: string) => ['messages-meta-data', conversationId];
export const getMessagesLastReadAtQueryKey = (conversationId: string) => ['messages-last-read-at', conversationId];
