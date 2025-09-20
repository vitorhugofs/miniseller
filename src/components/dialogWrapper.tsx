import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';
import React from 'react';

interface DialogWrapperProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function DialogWrapper({ open, onClose, title = "Panel title", children }: DialogWrapperProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/50 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute top-0 right-0 flex pt-4 pr-2 z-10 duration-500 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="relative rounded-md text-gray-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <p className="size-6">X</p>
                  </button>
                </div>
              </TransitionChild>
              <div className="relative flex h-full flex-col overflow-y-auto bg-gray-900 py-6 shadow-xl after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-white/10">
                <div className="px-4 sm:px-6">
                    <DialogTitle className="text-base font-semibold text-white">{title}</DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {children}
                </div>
            </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}