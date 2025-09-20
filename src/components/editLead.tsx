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
    <form className="mt-6 flex-1 px-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
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
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}