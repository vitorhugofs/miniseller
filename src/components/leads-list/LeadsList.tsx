import React from 'react';
import EditLead from './editLead';
import type { Lead } from '../../interfaces';

const SORT_KEY = 'leadSortOrder';
const STATUS_KEY = 'leadStatus';
const LEADS_KEY = 'leadsData';

export default function LeadsList() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState(() => localStorage.getItem(STATUS_KEY) || '');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>(
    () => (localStorage.getItem(SORT_KEY) as 'asc' | 'desc') || 'desc'
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);

  // Load leads from localStorage or fetch if not present
  React.useEffect(() => {
    const storedLeads = localStorage.getItem(LEADS_KEY);
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    } else {
      fetch('/data/leads.json')
        .then((response) => response.json())
        .then((data) => setLeads(data));
    }
  }, []);

  // Persist leads to localStorage when leads change
  React.useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    }
  }, [leads]);

  React.useEffect(() => {
    localStorage.setItem(STATUS_KEY, status);
  }, [status]);

  React.useEffect(() => {
    localStorage.setItem(SORT_KEY, sortOrder);
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
          <LeadCard key={lead.id} lead={lead} onClick={() => handleLeadClick(lead)} />
        ))}
      </div>
      <EditLead
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={selectedLead ? selectedLead.name : "Panel title"}
        lead={selectedLead}
        onSave={(updatedLead) => {
            setLeads(leads =>
            leads.map(l => l.id === updatedLead.id ? updatedLead : l)
            );
        }}
        />
    </div>
  );
}

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
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
    </div>
  );
}