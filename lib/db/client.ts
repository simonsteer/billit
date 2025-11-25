import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

let _db: ReturnType<typeof drizzle>

export const db = () => {
  _db ??= drizzle({ client: neon(process.env.DATABASE_URL!) })
  return _db
}
