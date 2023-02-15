import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

import migrationV1 from './migrations/v1'

export default schemaMigrations({
  migrations: [
    migrationV1,
  ],
})
