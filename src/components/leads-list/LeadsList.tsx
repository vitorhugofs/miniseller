import React from 'react';

const SORT_KEY = 'leadSortOrder';
const STATUS_KEY = 'leadStatus';

export default function LeadsList() {
  const [data, setData] = React.useState<Lead[]>([]);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState(() => localStorage.getItem('leadStatus') || '');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>(
    () => (localStorage.getItem(SORT_KEY) as 'asc' | 'desc') || 'desc'
  );

  React.useEffect(() => {
    fetch('/data/leads.json')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STATUS_KEY, status);
  }, [status]);

  React.useEffect(() => {
    localStorage.setItem(SORT_KEY, sortOrder);
  }, [sortOrder]);

  const statuses = Array.from(new Set(data.map((lead) => lead.status)));

  const filteredLeads = data
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
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: string;
}

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-bold mb-2 text-black">{lead.name}</h2>
      <p className="text-gray-600 mb-1">Company: {lead.company}</p>
      <p className="text-gray-600 mb-1">Email: {lead.email}</p>
      <p className="text-gray-600 mb-1">Source: {lead.source}</p>
      <p className="text-gray-600 mb-1">Score: {lead.score}</p>
      <p className="text-gray-600">Status: {lead.status}</p>
    </div>
  );
}