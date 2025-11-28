import { type } from 'arktype'
import { CURRENCIES } from '@/lib/currency/vars'
import { conversion_rates } from '@/lib/db/schema'

export const CurrencySchema = type('===', ...CURRENCIES)

export type Currency = typeof CurrencySchema.infer

export type FinancialExchangeRates = typeof conversion_rates.$inferSelect
