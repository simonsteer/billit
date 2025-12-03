'use client'

import { InputHTMLAttributes, useEffect, useRef } from 'react'
import { BusinessProfileJson } from '@/lib/business_profiles/types'
import { usePartialState } from '@/lib/shared/utils'
import { getBusinessProfileDiff } from '@/lib/business_profiles/utils'
import { trpc } from '@/lib/trpc/react'

export function BusinessProfileForm({
  profile: _profile,
}: {
  profile: BusinessProfileJson
}) {
  const { mutate } = trpc.updateBusinessProfile.useMutation()

  const [profile, setProfile] = usePartialState(_profile)
  const cached = useRef(profile)

  useEffect(() => {
    const updates = getBusinessProfileDiff(cached.current, profile)
    if (Object.keys(updates).length === 0) return

    const timeout = setTimeout(() => mutate({ id: profile.id, updates }), 500)
    return () => clearTimeout(timeout)
  }, [profile])

  const {
    address_line_1,
    address_line_2,
    business_name,
    city,
    country,
    state,
    zip_code,
  } = profile

  return (
    <div>
      <h2 className="text-28 leading-40 font-serif text-neutral-800 flex-1 mb-12">
        Business Profile
      </h2>
      <p className="text-16 leading-24 font-sans text-neutral-800 w-full max-w-2xl mb-32">
        Manage the details of your business. These fields will show up on your
        invoices and estimates, as well as in automated emails and messaging
        sent on your behalf by Billit.
      </p>
      <form className="flex flex-col gap-18 w-full max-w-420">
        <Input
          id="business_name"
          value={business_name || ''}
          setValue={business_name => setProfile({ business_name })}
          label="The name of your business"
          placeholder="eg. Jenna's Extreme Landscaping"
        />
        <Input
          id="address_line_1"
          value={address_line_1 || ''}
          setValue={address_line_1 => setProfile({ address_line_1 })}
          label="Address line 1"
          placeholder="eg. 123 Business Street"
        />
        <Input
          id="address_line_2"
          value={address_line_2 || ''}
          setValue={address_line_2 => setProfile({ address_line_2 })}
          label="Address line 2"
          placeholder="eg. Unit 456"
        />
        <div className="flex gap-12">
          <Input
            id="city"
            value={city || ''}
            setValue={city => setProfile({ city })}
            label="City"
            placeholder="eg. Burbank"
          />
          <Input
            id="state"
            value={state || ''}
            setValue={state => setProfile({ state })}
            label="State / Province"
            placeholder="eg. Oklahoma"
          />
        </div>
        <div className="flex gap-12">
          <Input
            id="country"
            value={country || ''}
            setValue={country => setProfile({ country })}
            label="Country"
            placeholder="eg. United States"
          />
          <Input
            id="zip_code"
            value={zip_code || ''}
            setValue={zip_code => setProfile({ zip_code })}
            label="Zip / Postal Code"
            placeholder="eg. 12345-6789"
          />
        </div>
      </form>
    </div>
  )
}

function Input({
  id,
  value,
  setValue,
  label,
  placeholder,
  type = 'text',
}: {
  id: string
  value: string
  setValue: (value: string) => void
  label: string
  placeholder?: string
  type?: InputHTMLAttributes<HTMLInputElement>['type']
}) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-12 leading-18 mb-12 font-semibold">
        {label}
      </label>
      <input
        id={id}
        className="bg-transparent w-full border border-neutral-300 text-neutral-800 placeholder:text-neutral-400 rounded-lg px-12 py-8 text-14 leading-20 font-sans outline-none focus:ring ring-lime-300"
        type={type}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
