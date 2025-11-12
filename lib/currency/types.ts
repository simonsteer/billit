import { type } from 'arktype'
import { CURRENCIES } from '@/lib/currency/vars'

export const CurrencySchema = type('===', ...CURRENCIES)

export type Currency = typeof CurrencySchema.infer
