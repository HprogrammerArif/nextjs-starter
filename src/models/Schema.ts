import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using Drizzle ORM.
//
// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`
// 3. Apply migrations using: `npm run db:migrate`

export const exampleTable = pgTable('example', {
  id: serial('id').primaryKey(),
  name: text('name'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
