import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./lib/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  }
})