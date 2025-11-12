import { Currency } from '@/lib/currency/types'

export const getCurrencyFormatParts = ({
  locale,
  currency,
}: {
  locale: string
  currency: Currency
}): { group: string; decimal: string; sym: string } => {
  const format = (currency: Currency) =>
    Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencySign: 'standard',
    }).formatToParts(12345.67)

  try {
    const parts = format(currency)
    const group = parts.find(p => p.type === 'group')?.value || ','
    const decimal = parts.find(p => p.type === 'decimal')?.value || '.'
    const sym = parts.find(p => p.type === 'currency')?.value || '.'

    return { group, decimal, sym }
  } catch (e) {
    console.error(e)
    return getCurrencyFormatParts({ locale: 'en-US', currency })
  }
}

export const getCurrencyFormatter = ({
  locale,
  currency,
}: {
  locale: string
  currency: Currency
}) => {
  return function formatCurrency(amount: number): string {
    const format = (currency: Currency) =>
      Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencySign: 'standard',
      }).format(amount)

    try {
      return format(currency)
    } catch (e) {
      console.error(e)
      return getCurrencyFormatter({ locale: 'en-US', currency })(amount)
    }
  }
}
