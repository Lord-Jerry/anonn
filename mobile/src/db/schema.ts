import {appSchema, tableSchema} from '@nozbe/watermelondb';

import db from '@constant/db';

const { tableNames } = db;

const schemas = [
  tableSchema({
    name: tableNames.conversations,
    columns: [
      // {name: 'id', type: 'string', isIndexed: true},
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
  tableSchema({
    name: tableNames.messages,
    columns: [
      // {name: 'id', type: 'string'},
      {name: 'conversation_id', type: 'string', isIndexed: true},
      {name: 'message', type: 'string'},
      {name: 'username', type: 'string'},
      {name: 'isMine', type: 'boolean'},
      {name: 'updated_at', type: 'number'},
    ],
  }),
  tableSchema({
    name: tableNames.config,
    columns: [
      {name: 'user_id', type: 'string', isOptional: true},
      // {name: 'username', type: 'string'},
      // {name: 'avatar', type: 'string'},
      // {name: 'token', type: 'string'},
      {name: 'message_last_fetched', type: 'number', isOptional: true},
    ],
  }),
];

export default appSchema({
  version: 1,
  tables: schemas,
});
