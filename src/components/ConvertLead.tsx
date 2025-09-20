import { useState } from 'react';
import type { Lead, Opportunity } from '../interfaces';

export default function ConvertLead({
  lead,
  onSave,
  onClose,
  leadsWithOpportunities,
}: {
  lead: Lead;
  onSave: (opportunity: Opportunity) => void;
  onClose: () => void;
  leadsWithOpportunities: Lead[];
}) {
  const [amount, setAmount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [stage, setStage] = useState('Started');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!amount || !accountName) return;
    const opportunity: Opportunity = {
      id: lead.id,
      name: lead.name,
      stage,
      amount,
      accountName,
    };
    onSave(opportunity);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4 text-white">Leads with Opportunities</h3>
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-2 py-1 text-gray-700 text-left">Name</th>
              <th className="px-2 py-1 text-gray-700 text-left">Stage</th>
              <th className="px-2 py-1 text-gray-700 text-left">Amount</th>
              <th className="px-2 py-1 text-gray-700 text-left">Account Name</th>
            </tr>
          </thead>
          <tbody>
            {leadsWithOpportunities.map((l) => (
              <tr key={l.id}>
                <td className="px-2 py-1 text-gray-600">{l.name}</td>
                <td className="px-2 py-1 text-gray-600">{l.Opportunity?.stage}</td>
                <td className="px-2 py-1 text-gray-600">{l.Opportunity?.amount}</td>
                <td className="px-2 py-1 text-gray-600">{l.Opportunity?.accountName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form
      className="p-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <h3 className="text-lg font-bold mb-4 text-white">{lead.name}</h3>
      <label className="block mb-2 text-sm text-gray-300">Amount</label>
      <input
        type="text"
        className="mb-4 p-2 border rounded w-full text-black"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <label className="block mb-2 text-sm text-gray-300">Account Name</label>
      <input
        type="text"
        className="mb-4 p-2 border rounded w-full text-black"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        required
      />
      <label className="block mb-2 text-sm text-gray-300">Stage</label>
      <select
        className="mb-4 p-2 border rounded w-full text-black"
        value={stage}
        onChange={(e) => setStage(e.target.value)}
      >
        <option value="Started">Started</option>
        <option value="Finished">Finished</option>
      </select>
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
          Close
        </button>
      </div>
    </form>
  );
}