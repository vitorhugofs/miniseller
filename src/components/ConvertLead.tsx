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
  const [accountName, setAccountName] = useState(lead.company);
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
      <div className="flex-1">
        <h3 className="text-lg font-bold mt-4 mb-2 text-white">Leads with Opportunities</h3>
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-2 py-2 text-gray-700 text-left">Name</th>
              <th className="px-2 py-2 text-gray-700 text-left">Stage</th>
              <th className="px-2 py-2 text-gray-700 text-left">Amount</th>
              <th className="px-2 py-2 text-gray-700 text-left">Account Name</th>
            </tr>
          </thead>
          <tbody>
            {leadsWithOpportunities.map((l) => (
              <tr key={l.id}>
                <td className="px-2 py-2 text-gray-600">{l.name}</td>
                <td className="px-2 py-2 text-gray-600">{l.Opportunity?.stage}</td>
                <td className="px-2 py-2 text-gray-600">{l.Opportunity?.amount}</td>
                <td className="px-2 py-2 text-gray-600">{l.Opportunity?.accountName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <label className="block mb-2 text-sm text-gray-300">Amount</label>
      <input
        type="text"
        className="mb-4 p-2 bg-black text-white rounded w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
        value={amount}
        placeholder='e.g., "$5000"'
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <label className="block mb-2 text-sm text-gray-300">Account Name</label>
      <input
        type="text"
        className="mb-4 p-2 bg-black text-white rounded w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
        value={accountName}
        placeholder='e.g., "Acme Corp"'
        onChange={(e) => setAccountName(e.target.value)}
        required
      />
      <label className="block mb-2 text-sm text-gray-300">Stage</label>
      <select
        className="mb-4 p-2 bg-black text-white rounded w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
        value={stage}
        onChange={(e) => setStage(e.target.value)}
      >
        <option value="Started">Started</option>
        <option value="Finished">Finished</option>
      </select>
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
          Close
        </button>
      </div>
    </form>
  );
}