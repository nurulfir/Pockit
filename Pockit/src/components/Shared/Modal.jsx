import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal container dengan scroll */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-xl max-h-[90vh] rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col">
                {/* Close button - sticky */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={onClose}
                    aria-label="Tutup"
                    className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-lg hover:scale-105 transition"
                  >
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </button>
                </div>

                {/* Header - sticky */}
                <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-white/20 dark:border-gray-700 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
                  <Dialog.Title className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white pr-12">
                    {title}
                  </Dialog.Title>
                </div>

                {/* Content - scrollable */}
                <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};