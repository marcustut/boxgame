import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'

export type SelectData<TType = string> = {
  id: string | number
  name: string
  value: TType
  disabled?: boolean
}

export type SelectProps<TType = string> = {
  value: TType
  onChange(value: TType): void
  data: SelectData<TType>[]
  placeholder?: string
  error?: string
  className?: string
}

export function Select<TType>({
  value,
  onChange,
  data,
  placeholder = 'Select a value',
  error,
  className
}: SelectProps<TType>) {
  const name = data.filter(d => d.value === value).length !== 0 ? data.filter(d => d.value === value)[0].name : null

  return (
    <Listbox value={value} onChange={onChange}>
      <Listbox.Button
        data-blobity-magnetic='false'
        className={`relative text-left w-full py-2 px-4 rounded-lg bg-dark-100 text-true-gray-50 focus:outline-none ${
          error ? `ring-2 ring-[#ff4d4d]` : `hover:ring-2 focus:ring-2 ring-primary-ring`
        } transition duration-200 ease-in-out ${className}`}
      >
        <span className={`block truncate ${!value ? 'text-true-gray-500' : ''}`}>{value ? name : placeholder}</span>
        <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
          <Icon icon='heroicons-outline:selector' className='w-5 h-5 text-gray-400' aria-hidden='true' />
        </span>
      </Listbox.Button>
      <Listbox.Options
        style={{ listStyle: 'none', paddingLeft: 0 }}
        className='w-full py-1 mt-1 overflow-auto text-base bg-true-gray-500 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
      >
        {data.map(data => (
          <Listbox.Option
            key={data.id}
            value={data.value}
            disabled={data.disabled === true}
            className={({ active }) => `${active ? 'text-secondary bg-secondary-light' : 'text-true-gray-50'}
                          cursor-default select-none relative py-2 pl-10 pr-4`}
          >
            {({ selected, active }) => (
              <>
                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>{data.name}</span>
                {selected ? (
                  <span
                    className={`${active ? 'text-black' : 'text-black'}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                  >
                    <Icon icon='heroicons-solid:check' className='w-5 h-5' aria-hidden='true' />
                  </span>
                ) : null}
              </>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}
