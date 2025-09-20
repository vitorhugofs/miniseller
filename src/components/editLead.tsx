import { useEffect, useState } from 'react';
import type { Lead } from '../interfaces';

interface EditLeadProps {
  lead?: Lead | null;
  onSave?: (lead: Lead) => void;
  onClose: () => void;
}

const STATUS_OPTIONS = ["Qualified", "Contacted", "New"] as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditLead({ lead, onSave, onClose }: EditLeadProps) {
  const [email, setEmail] = useState(lead?.email ?? '');
  const [status, setStatus] = useState<Lead["status"]>(lead?.status ?? "New");
  const [error, setError] = useState('');

  useEffect(() => {
    setEmail(lead?.email ?? '');
    setStatus(lead?.status ?? "New");
    setError('');
  }, [lead]);

  if (!lead) return null;

  const handleSave = () => {
    if (!EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const updatedLead = { ...lead, email, status };
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
    <form className="flex-1" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <label className="block mb-2 text-sm text-gray-300">Email</label>
      <input
        type="email"
        className="mb-4 p-2 bg-black text-white rounded w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="example@domain.com"
      />
      <label className="block mb-2 text-sm text-gray-300">Status</label>
      <select
        className="mb-4 p-2 bg-black text-white rounded w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
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
          type="submit"
          className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}