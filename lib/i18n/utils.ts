import { headers } from 'next/headers'

/**
 * `acceptLanguage` should be the value of Accept-Language HTTP header.
 *
 *  eg:
 *
 * "en-CA", "en-CA,en-US;q=0.7,en;q=0.3"
 * */
export function inferLocale(acceptLanguage?: string | null | undefined) {
  if (!acceptLanguage) return 'en-US'

  const locales = acceptLanguage.split(',').map(part => {
    const [locale, w] = part.split(';')
    const weight = w ? parseFloat(w.slice(2)) : 1
    const value = Number.isNaN(weight)
      ? { locale, weight: 0 }
      : { locale, weight }
    return value
  })

  try {
    const supported = Intl.NumberFormat.supportedLocalesOf(
      locales.toSorted((a, b) => b.weight - a.weight).map(n => n.locale),
      { localeMatcher: 'lookup' }
    )
    return supported[0] || 'en-US'
  } catch {
    console.error(`Unable to parse locale from value "${acceptLanguage}"`)
    return 'en-US'
  }
}

export async function inferLocaleFromHeaders() {
  const acceptLanguage = (await headers()).get('Accept-Language')
  return inferLocale(acceptLanguage)
}
