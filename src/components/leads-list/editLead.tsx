'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { useEffect, useState } from 'react';
import type { Lead } from '../../interfaces';

interface EditLeadProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    lead?: Lead | null;
    onSave?: (lead: Lead) => void;
  }

const STATUS_OPTIONS = ["Qualified", "Contacted", "New"] as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditLead({ open, onClose, title = "Panel title", lead, onSave }: EditLeadProps) {
    const [email, setEmail] = useState(lead?.email ?? '');
    const [status, setStatus] = useState<Lead["status"]>(lead?.status ?? "New");
    const [error, setError] = useState('');
  
    useEffect(() => {
      setEmail(lead?.email ?? '');
      setStatus(lead?.status ?? "New");
      setError('');
    }, [lead, open]);
  
    if (!open || !lead) return null;
  
    const handleSave = () => {
      if (!EMAIL_REGEX.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      const updatedLead = { ...lead, email, status };
      // Update localStorage
      const leadsData = localStorage.getItem('leadsData');
      if (leadsData) {
        const leads: Lead[] = JSON.parse(leadsData);
        const idx = leads.findIndex(l => l.id === lead.id);
        if (idx !== -1) {
          leads[idx] = updatedLead;
          localStorage.setItem('leadsData', JSON.stringify(leads));
        }
      }
      if (onSave) onSave(updatedLead);
      onClose();
    };

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
                    {/* close button in top right corner */}
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
                    <div className="relative flex h-full flex-col overflow-y-auto bg-gray-800 py-6 shadow-xl after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-white/10">
                    <div className="px-4 sm:px-6">
                        <DialogTitle className="text-base font-semibold text-white">{title}</DialogTitle>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">                    
                    <div className="mt-6 flex-1 px-6">
                    <label className="block mb-2 text-sm text-gray-300">Email</label>
                    <input
                        type="email"
                        className="mb-4 p-2 border rounded w-full text-black"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="example@domain.com"
                    />
                    <label className="block mb-2 text-sm text-gray-300">Status</label>
                    <select
                        className="mb-4 p-2 border rounded w-full text-black"
                        value={status}
                        onChange={e => setStatus(e.target.value as Lead["status"])}
                    >
                        {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <div className="flex gap-2 mt-4">
                        <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleSave}
                        >
                        Save
                        </button>
                        <button
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        onClick={onClose}
                        >
                        Cancel
                        </button>
                    </div>
                  </div>
                </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
  )
}