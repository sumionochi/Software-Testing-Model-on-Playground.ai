// schema.ts
import { pgTable, uuid, text, varchar, boolean } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(), // UUID as primary key
  full_name: text('full_name').notNull(), // Name as text
  email: text('email').notNull(), // Email with uniqueness constraint
  avatar_url: text('avatar_url'), // Avatar URL field
  subscription: boolean('subscription').default(false), // Subscription as boolean with default false
});