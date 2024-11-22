import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { profiles } from './schema'


if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const connectionString = process.env.DATABASE_URL as string;

// Disable prefetch as it is not supported for "Transaction" pool mode 
const client = postgres(connectionString, { prepare: false })
const db = drizzle(client);

const allProfiles = await db.select().from(profiles);
console.log(allProfiles);