import { CURRENCIES } from '@/lib/currency/vars'

import { pgEnum } from 'drizzle-orm/pg-core'

export const currenciesEnum = pgEnum('currencies', CURRENCIES)
