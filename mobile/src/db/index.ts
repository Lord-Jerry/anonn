import {Q, Database, Model, Relation} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {
  field,
  text,
  date,
  children,
  relation,
} from '@nozbe/watermelondb/decorators';

import db from '@constant/db';

import schema from './schema';

const {tableNames} = db;

export class Conversations extends Model {
  static table = tableNames.conversations;
  static associations = {
    [tableNames.messages]: {type: 'has_many', foreignKey: 'conversation_id'},
  } as const;

  @text('name') name!: string;
  @text('description') description!: string;
  @text('status') status!: string;
  @text('avatar') avatar!: string;
  @field('is_group') isGroup!: boolean;
  @field('is_open') isOpen!: boolean;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @children(tableNames.messages) messages!: Messages[];

  unreadMessagesCount = this.collections
    .get(tableNames.messages)
    .query(
      Q.where('conversation_id', this.id),
      // Q.where('is_mine', false),
      // Q.where('is_read', false),
    ).observeCount;
}

export class Messages extends Model {
  static table = tableNames.messages;
  static associations = {
    [tableNames.conversations]: {type: 'belongs_to', key: 'conversation_id'},
  } as const;

  @field('conversation_id') conversationId!: string;
  @text('message') message!: string;
  @text('username') username!: string;
  @field('isMine') isMine!: boolean;
  @date('updated_at') updatedAt!: Date;

  @relation(tableNames.conversations, 'conversation_id')
  conversation!: Relation<Conversations>;
}

export class Config extends Model {
  static table = tableNames.config;

  @text('user_id') userId!: string;
  @field('message_last_fetched') messageLastFetched!: Date;
}

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'Anonn',
  //   migrations,
});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [Conversations, Messages, Config],
});
