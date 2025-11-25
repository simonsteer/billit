import { getFakeInvoice } from '@/lib/invoices/utils'

async function main() {
  // delete invoices from development database

  // batch create fake invoices for each admin user
  const invoices = process.env
    .ADMIN_USER_IDS!.split(',')
    .flatMap(userId => [...Array(500)].map(() => getFakeInvoice(userId)))
}

main()
