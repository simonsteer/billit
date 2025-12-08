import { InputHTMLAttributes } from 'react'

export function TextInput({
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
  type?: Extract<
    InputHTMLAttributes<HTMLInputElement>['type'],
    'text' | 'email' | 'password' | 'tel' | 'url'
  >
}) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-12 leading-18 mb-12 font-semibold">
        {label}
      </label>
      <input
        id={id}
        className="bg-transparent w-full border border-neutral-300 text-neutral-800 placeholder:text-neutral-400 rounded-lg px-12 py-8 text-14 leading-20 font-sans outline-none focus:ring ring-inset ring-neutral-300"
        type={type}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
