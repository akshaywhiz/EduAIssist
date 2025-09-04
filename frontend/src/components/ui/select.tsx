'use client'

import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

type Option = { value: string; label: string }

type SelectProps = {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Select({ value, onChange, options, placeholder = 'Select…', disabled, className }: SelectProps) {
  const selected = options.find((o) => o.value === value) || null

  return (
    <Listbox value={selected} onChange={(opt: Option | null) => onChange(opt?.value ?? '')} disabled={disabled}>
      <div className={`relative ${className ?? ''}`}>
        <Listbox.Button className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-9 text-left text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-100 disabled:text-gray-400">
          <span className="block truncate">{selected ? selected.label : <span className="text-gray-400">{placeholder}</span>}</span>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronUpDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
            {options.length === 0 && (
              <div className="px-3 py-2 text-gray-500">No options</div>
            )}
            {options.map((opt) => (
              <Listbox.Option
                key={opt.value}
                className={({ active }) => `relative cursor-default select-none px-3 py-2 ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`}
                value={opt}
              >
                {({ selected: isSelected }) => (
                  <div className="flex items-center">
                    <span className={`block truncate ${isSelected ? 'font-medium text-indigo-700' : 'font-normal'}`}>{opt.label}</span>
                    {isSelected ? (
                      <span className="ml-auto text-indigo-600">
                        <CheckIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : null}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}


