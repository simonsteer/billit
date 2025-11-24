import { getFirestore } from 'firebase-admin/firestore'
import { initializeFirebase } from '@/lib/firebase'

import { config } from 'dotenv'
import { getFakeInvoice } from '@/lib/invoices/utils'
config()

async function main() {
  initializeFirebase()
  const firestore = getFirestore('development')

  // delete invoices from development firestore
  await firestore.recursiveDelete(firestore.collection('invoices'))

  // batch create fake invoices for each admin user
  const batches = process.env
    .ADMIN_USER_IDS!.split(',')
    .map(userId => [...Array(500)].map(() => getFakeInvoice(userId)))
    .map(async invoices => {
      const batch = firestore.batch()
      invoices.forEach(invoice => {
        const ref = firestore.doc(`invoices/${invoice.id}`)
        batch.create(ref, invoice)
      })
      return await batch.commit()
    })

  await Promise.all(batches)
}

main()
