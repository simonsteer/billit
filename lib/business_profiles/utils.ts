import { BusinessProfileJson } from '@/lib/business_profiles/types'

export function getBusinessProfileDiff(
  a: BusinessProfileJson,
  b: BusinessProfileJson
) {
  const diff: Partial<BusinessProfileJson> = {}

  if (a.address_line_1 !== b.address_line_1) {
    diff.address_line_1 = b.address_line_1
  }
  if (a.address_line_2 !== b.address_line_2) {
    diff.address_line_2 = b.address_line_2
  }
  if (a.business_name !== b.business_name) {
    diff.business_name = b.business_name
  }
  if (a.city !== b.city) {
    diff.city = b.city
  }
  if (a.country !== b.country) {
    diff.country = b.country
  }
  if (a.email !== b.email) {
    diff.email = b.email
  }
  if (a.state !== b.state) {
    diff.state = b.state
  }
  if (a.zip_code !== b.zip_code) {
    diff.zip_code = b.zip_code
  }

  return diff
}
