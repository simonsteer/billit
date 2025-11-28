import BigNumber from 'bignumber.js'
import { Currency, FinancialExchangeRates } from '@/lib/currency/types'
import { db } from '@/lib/db/client'
import { conversion_rates } from '@/lib/db/schema'

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

export async function updateConversionRates() {
  const [fx] = await fetch(
    `https://openexchangerates.org/api/latest.json?app_id=${process.env.OXR_APP_ID}&base=USD`
  )
    .then(res => res.json())
    .then(data =>
      db()
        .insert(conversion_rates)
        .values({ id: 'singleton', data })
        .onConflictDoUpdate({ target: conversion_rates.id, set: { data } })
        .returning()
    )

  return fx
}

export async function getConversionRates() {
  const [rates] = await db().select().from(conversion_rates)
  return rates
}

export function convertCurrency(
  value: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  fx: FinancialExchangeRates
) {
  const rateA = fx.data.rates[toCurrency]
  const rateB = fx.data.rates[fromCurrency]

  const converted = BigNumber(value)
    .multipliedBy(BigNumber(rateA).dividedBy(rateB))
    .decimalPlaces(0)
    .toNumber()

  return converted
}
