import React, { useState } from 'react';
import EditLead from './editLead';
import type { Lead } from '../interfaces';
import DialogWrapper from './dialogWrapper';

interface Opportunity {
  id: string;
  name: string;
  stage: string;
  amount: string;
  accountName: string;
}

function ConvertLead({
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
              <th className="px-2 py-1 text-left">Name</th>
              <th className="px-2 py-1 text-left">Stage</th>
              <th className="px-2 py-1 text-left">Amount</th>
              <th className="px-2 py-1 text-left">Account Name</th>
            </tr>
          </thead>
          <tbody>
            {leadsWithOpportunities.map((l) => (
              <tr key={l.id}>
                <td className="px-2 py-1">{l.name}</td>
                <td className="px-2 py-1">{l.Opportunity?.stage}</td>
                <td className="px-2 py-1">{l.Opportunity?.amount}</td>
                <td className="px-2 py-1">{l.Opportunity?.accountName}</td>
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

export default function LeadsList() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState(() => localStorage.getItem('leadStatus') || '');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>(
    () => (localStorage.getItem('leadSortOrder') as 'asc' | 'desc') || 'desc'
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);

  // Convert dialog state
  const [convertOpen, setConvertOpen] = React.useState(false);
  const [convertLead, setConvertLead] = React.useState<Lead | null>(null);

  React.useEffect(() => {
    const storedLeads = localStorage.getItem('leadsData');
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    } else {
      fetch('/data/leads.json')
        .then((response) => response.json())
        .then((data) => setLeads(data));
    }
  }, []);

  React.useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('leadsData', JSON.stringify(leads));
    }
  }, [leads]);

  React.useEffect(() => {
    localStorage.setItem('leadStatus', status);
  }, [status]);

  React.useEffect(() => {
    localStorage.setItem('leadSortOrder', sortOrder);
  }, [sortOrder]);

  const statuses = Array.from(new Set(leads.map((lead) => lead.status)));

  const filteredLeads = leads
    .filter(
      (lead) =>
        (lead.name.toLowerCase().includes(search.toLowerCase()) ||
          lead.email.toLowerCase().includes(search.toLowerCase())) &&
        (status === '' || lead.status === status)
    )
    .sort((a, b) =>
      sortOrder === 'asc' ? a.score - b.score : b.score - a.score
    );

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedLead(null);
  };

  // Convert logic
  const handleConvertClick = (lead: Lead) => {
    setConvertLead(lead);
    setConvertOpen(true);
  };

  const handleCloseConvert = () => {
    setConvertOpen(false);
    setConvertLead(null);
  };

  const handleSaveOpportunity = (opportunity: Opportunity) => {
    setLeads((prevLeads) =>
      prevLeads.map((l) =>
        l.id === opportunity.id
          ? { ...l, Opportunity: opportunity }
          : l
      )
    );
  };

  const leadsWithOpportunities = leads.filter((l) => l.Opportunity);

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          className="p-2 border rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          className="p-1 bg-transparent rounded flex items-center"
          onClick={handleSortToggle}
          title={`Sort by score (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}
        >
          {sortOrder === 'asc' ? (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M12 8l-6 6h12l-6-6z" fill="#fff"/>
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M12 16l6-6H6l6 6z" fill="#fff"/>
            </svg>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => handleLeadClick(lead)}
            onConvert={() => handleConvertClick(lead)}
          />
        ))}
      </div>
      <DialogWrapper
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={selectedLead ? selectedLead.name : "Panel title"}
      >
        <EditLead
          lead={selectedLead}
          onSave={updatedLead => {
            setLeads(leads => leads.map(l => l.id === updatedLead.id ? updatedLead : l));
          }}
          onClose={handleCloseDialog}
        />
      </DialogWrapper>
      <DialogWrapper
        open={convertOpen}
        onClose={handleCloseConvert}
        title={convertLead ? `Convert ${convertLead.name}` : "Convert Lead"}
      >
        {convertLead && (
          <ConvertLead
            lead={convertLead}
            onSave={handleSaveOpportunity}
            onClose={handleCloseConvert}
            leadsWithOpportunities={leadsWithOpportunities}
          />
        )}
      </DialogWrapper>
    </div>
  );
}

function LeadCard({
  lead,
  onClick,
  onConvert,
}: {
  lead: Lead;
  onClick: () => void;
  onConvert: () => void;
}) {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold mb-2 text-black">{lead.name}</h2>
      <p className="text-gray-600 mb-1">Company: {lead.company}</p>
      <p className="text-gray-600 mb-1">Email: {lead.email}</p>
      <p className="text-gray-600 mb-1">Source: {lead.source}</p>
      <p className="text-gray-600 mb-1">Score: {lead.score}</p>
      <p className="text-gray-600">Status: {lead.status}</p>
      <button
        className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        onClick={(e) => {
          e.stopPropagation();
          onConvert();
        }}
      >
        Convert
      </button>
    </div>
  );
}