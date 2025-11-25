import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
config({ path: '.env' })

export const db = drizzle({ client: neon(process.env.DATABASE_URL!) })
