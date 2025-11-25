import { config } from 'dotenv'
import { getFakeInvoice } from '@/lib/invoices/utils'
import { db } from '@/lib/db/client'
import { invoices } from '@/lib/db/schema'
import { updateConversionRates } from '@/lib/currency/utils'

config({ path: '.env' })

async function main() {
  // update currency conversion rates
  await updateConversionRates()

  // delete invoices from development database
  await db.delete(invoices)

  // bulk insert fake invoices for each admin user
  await db
    .insert(invoices)
    .values(
      process.env
        .ADMIN_USER_IDS!.split(',')
        .flatMap(userId => [...Array(500)].map(() => getFakeInvoice(userId)))
    )
}

main()
