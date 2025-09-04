'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidthClass?: string
}

export function Modal({ open, onClose, title, children, maxWidthClass }: ModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${maxWidthClass ?? 'max-w-lg'} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}>
                {title && (
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    {title}
                  </Dialog.Title>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}


