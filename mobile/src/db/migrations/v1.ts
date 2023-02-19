import {
  schemaMigrations,
  createTable,
} from '@nozbe/watermelondb/Schema/migrations';
import db from '@constant/db';

const {tableNames} = db;

export default {
  toVersion: 1,
  steps: [
    createTable({
      name: tableNames.conversations,
      columns: [
        {name: 'id', type: 'string', isIndexed: true},
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string', isOptional: true},
        {name: 'status', type: 'string'},
        {name: 'avatar', type: 'string'},
        {name: 'is_group', type: 'boolean'},
        {name: 'is_open', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    createTable({
      name: tableNames.messages,
      columns: [
        {name: 'id', type: 'string'},
        {name: 'conversation_id', type: 'string', isIndexed: true},
        {name: 'message', type: 'string'},
        {name: 'username', type: 'string'},
        {name: 'isMine', type: 'boolean'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    createTable({
      name: tableNames.config,
      columns: [
        {name: 'user_id', type: 'string'},
        // {name: 'username', type: 'string'},
        // {name: 'avatar', type: 'string'},
        // {name: 'token', type: 'string'},
        {name: 'message_last_fetched', type: 'number', isOptional: true},
      ],
    }),
  ],
};
