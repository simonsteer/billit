import { createInsertSchema, createSelectSchema } from 'drizzle-arktype'
import { business_profiles } from '@/lib/db/schema'

export const BusinessProfileSchema = createSelectSchema(business_profiles)

export const BusinessProfileInsertSchema = createInsertSchema(business_profiles)

export const BusinessProfileUpdateSchema = BusinessProfileSchema.omit(
  'id',
  'created_at',
  'updated_at'
).partial()

export type BusinessProfileJson = typeof BusinessProfileSchema.infer
