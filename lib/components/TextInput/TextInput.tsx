import { InputHTMLAttributes, useState } from 'react'

export function TextInput({
  id,
  value,
  setValue,
  label,
  placeholder,
  type = 'text',
  cleanse = v => v,
  validate = () => null,
}: {
  id: string
  value: string
  setValue: (value: string) => void
  label: string
  placeholder?: string
  type?: Extract<
    InputHTMLAttributes<HTMLInputElement>['type'],
    'text' | 'email' | 'password' | 'tel' | 'url'
  >
  cleanse?: (value: string) => string
  validate?: (cleansed: string) => null | string
}) {
  const [didType, setDidType] = useState(false)
  const [canShowErrors, setCanShowErrors] = useState(false)
  const cleansed = cleanse(value)
  const error = validate(cleansed)

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-12 leading-18 mb-12 font-semibold">
        {label}
      </label>
      {canShowErrors && error && (
        <span className="text-12 leading-18 text-red-600 mb-12">{error}</span>
      )}
      <input
        id={id}
        className="bg-transparent w-full border border-neutral-300 text-neutral-800 placeholder:text-neutral-400 rounded-lg px-12 py-8 text-14 leading-20 font-sans outline-none focus:ring ring-inset ring-neutral-300"
        type={type}
        value={value}
        onChange={e => {
          if (!didType) setDidType(true)
          setValue(e.target.value)
        }}
        onFocus={() => {
          if (!didType) return
          setCanShowErrors(!!error)
        }}
        onBlur={() => {
          if (!didType) return
          if (!canShowErrors) setCanShowErrors(true)
          setValue(cleansed)
        }}
        placeholder={placeholder}
      />
    </div>
  )
}
