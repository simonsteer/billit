'use client'

import { InvoiceJson } from '@/lib/invoices/types'
import { ClientJson } from '@/lib/clients/types'
import { BusinessProfileJson } from '@/lib/business_profiles/types'
import { TextInput } from '@/lib/components'
import { usePartialState } from '@/lib/hooks'

export function InvoiceEditorForm({
  invoice: _invoice,
  client: _client,
  business_profile: _business_profile,
}: {
  invoice: InvoiceJson
  client: ClientJson
  business_profile: BusinessProfileJson
}) {
  const [business_profile, setProfile] = usePartialState(_business_profile)
  const [client, setCleint] = usePartialState(_client)

  return (
    <div>
      <form>
        <h2 className="text-28 leading-40 font-serif text-neutral-800 mb-12">
          Your business details
        </h2>
        <div className="flex flex-col gap-18">
          <TextInput
            id="business_name"
            value={business_profile.business_name || ''}
            setValue={business_name => setProfile({ business_name })}
            label="The name of your business"
            placeholder="eg. Jenna's Extreme Landscaping"
          />
          <TextInput
            id="address_line_1"
            value={business_profile.address_line_1 || ''}
            setValue={address_line_1 => setProfile({ address_line_1 })}
            label="Address line 1"
            placeholder="eg. 123 Business Street"
          />
          <TextInput
            id="address_line_2"
            value={business_profile.address_line_2 || ''}
            setValue={address_line_2 => setProfile({ address_line_2 })}
            label="Address line 2"
            placeholder="eg. Unit 456"
          />
          <div className="flex gap-12">
            <TextInput
              id="city"
              value={business_profile.city || ''}
              setValue={city => setProfile({ city })}
              label="City"
              placeholder="eg. Burbank"
            />
            <TextInput
              id="state"
              value={business_profile.state || ''}
              setValue={state => setProfile({ state })}
              label="State / Province"
              placeholder="eg. Oklahoma"
            />
          </div>
          <div className="flex gap-12">
            <TextInput
              id="country"
              value={business_profile.country || ''}
              setValue={country => setProfile({ country })}
              label="Country"
              placeholder="eg. United States"
            />
            <TextInput
              id="zip_code"
              value={business_profile.zip_code || ''}
              setValue={zip_code => setProfile({ zip_code })}
              label="Zip / Postal Code"
              placeholder="eg. 12345-6789"
            />
          </div>
        </div>
        <h2 className="text-28 leading-40 font-serif text-neutral-800 mb-12 mt-40">
          Your client's details
        </h2>
        <div className="flex flex-col gap-18">
          <TextInput
            id="business_name"
            value={client.client_name || ''}
            setValue={business_name => setProfile({ business_name })}
            label="The name of your business"
            placeholder="eg. Jenna's Extreme Landscaping"
          />
          <TextInput
            id="address_line_1"
            value={client.address_line_1 || ''}
            setValue={address_line_1 => setProfile({ address_line_1 })}
            label="Address line 1"
            placeholder="eg. 123 Business Street"
          />
          <TextInput
            id="address_line_2"
            value={client.address_line_2 || ''}
            setValue={address_line_2 => setProfile({ address_line_2 })}
            label="Address line 2"
            placeholder="eg. Unit 456"
          />
          <div className="flex gap-12">
            <TextInput
              id="city"
              value={client.city || ''}
              setValue={city => setProfile({ city })}
              label="City"
              placeholder="eg. Burbank"
            />
            <TextInput
              id="state"
              value={client.state || ''}
              setValue={state => setProfile({ state })}
              label="State / Province"
              placeholder="eg. Oklahoma"
            />
          </div>
          <div className="flex gap-12">
            <TextInput
              id="country"
              value={client.country || ''}
              setValue={country => setProfile({ country })}
              label="Country"
              placeholder="eg. United States"
            />
            <TextInput
              id="zip_code"
              value={client.zip_code || ''}
              setValue={zip_code => setProfile({ zip_code })}
              label="Zip / Postal Code"
              placeholder="eg. 12345-6789"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
