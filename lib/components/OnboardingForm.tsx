'use client'

import { BusinessProfileJson } from '@/lib/business_profiles/types'
import { TextInput } from '@/lib/components'
import { usePartialState } from '@/lib/hooks'
import clsx from 'clsx'

export function OnboardingForm() {
  const [profile, setProfile] = usePartialState<
    Omit<BusinessProfileJson, 'id' | 'created_at' | 'updated_at' | 'user_id'>
  >({
    address_line_1: '',
    address_line_2: '',
    business_name: '',
    city: '',
    country: '',
    email: '',
    state: '',
    zip_code: '',
  })

  const {
    address_line_1,
    address_line_2,
    business_name,
    city,
    country,
    state,
    zip_code,
  } = profile

  const disabled = business_name.trim().length < 2

  return (
    <form className="flex flex-col gap-18 w-full">
      <TextInput
        id="business_name"
        value={business_name || ''}
        setValue={business_name => setProfile({ business_name })}
        label="The name of your business *"
        placeholder="eg. Jenna's Extreme Landscaping"
        cleanse={value => value.trim()}
        validate={value => {
          if (value.length === 0) {
            return 'This is a required field'
          }
          if (value.length < 2) {
            return 'Business name must be at least 2 characters long'
          }
          return null
        }}
      />
      <TextInput
        id="address_line_1"
        value={address_line_1 || ''}
        setValue={address_line_1 => setProfile({ address_line_1 })}
        label="Address line 1"
        placeholder="eg. 123 Business Street"
      />
      <TextInput
        id="address_line_2"
        value={address_line_2 || ''}
        setValue={address_line_2 => setProfile({ address_line_2 })}
        label="Address line 2"
        placeholder="eg. Unit 456"
      />
      <div className="flex gap-18">
        <TextInput
          id="city"
          value={city || ''}
          setValue={city => setProfile({ city })}
          label="City"
          placeholder="eg. Burbank"
        />
        <TextInput
          id="state"
          value={state || ''}
          setValue={state => setProfile({ state })}
          label="State / Province"
          placeholder="eg. Oklahoma"
        />
      </div>
      <div className="flex gap-18">
        <TextInput
          id="country"
          value={country || ''}
          setValue={country => setProfile({ country })}
          label="Country"
          placeholder="eg. United States"
        />
        <TextInput
          id="zip_code"
          value={zip_code || ''}
          setValue={zip_code => setProfile({ zip_code })}
          label="Zip / Postal Code"
          placeholder="eg. 12345-6789"
        />
      </div>
      <button
        className={clsx(
          'mt-40 ml-auto text-14 leading-20 px-12 py-6 text-white rounded-sm font-semibold',
          disabled ? 'bg-neutral-200' : 'bg-blue-400'
        )}
      >
        Submit
      </button>
    </form>
  )
}
