import { updateConversionRates } from '@/lib/currency/utils'

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization')
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  await updateConversionRates()
  return Response.json({ success: true })
}
