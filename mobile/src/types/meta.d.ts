export interface IConversationsMetaData {
  count: number;
  lastSyncedAt: Date;
  index: {
    [key: string]: number;
  };
}
