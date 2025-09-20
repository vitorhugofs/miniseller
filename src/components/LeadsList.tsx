import EditLead from './editLead';
import ConvertLead from './ConvertLead';
import LeadCard from './LeadCard';
import type { Lead, Opportunity } from '../interfaces';
import DialogWrapper from './dialogWrapper';
import { useEffect, useState } from 'react';

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(() => localStorage.getItem('leadStatus') || '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    () => (localStorage.getItem('leadSortOrder') as 'asc' | 'desc') || 'desc'
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Convert dialog state
  const [convertOpen, setConvertOpen] = useState(false);
  const [convertLead, setConvertLead] = useState<Lead | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        const storedLeads = localStorage.getItem('leadsData');
        if (storedLeads) {
          setLeads(JSON.parse(storedLeads));
          setLoading(false);
        } else {
          fetch('/data/leads.json')
            .then((response) => {
              if (!response.ok) throw new Error('Failed to fetch leads');
              return response.json();
            })
            .then((data) => {
              setTimeout(() => {
                setLeads(data);
                setLoading(false);
              }, 1000);
            })
            .catch((err) => {
              setError(err.message);
              setLoading(false);
            });
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (search !== '' || status !== '') {
      setLoading(true);
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [search, status]);

  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('leadsData', JSON.stringify(leads));
    }
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('leadStatus', status);
  }, [status]);

  useEffect(() => {
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
          className="p-2 bg-black text-white rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-black text-white rounded p-2 appearance focus:outline-none focus:ring-2 focus:ring-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <a
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
        </a>
      </div>
      {loading && (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <span className="text-gray-400 text-xl">Loading leads...</span>
        </div>
      )}
      {error && (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <span className="text-red-400 text-xl">Error: {error}</span>
        </div>
      )}
      {!loading && !error && filteredLeads.length === 0 && (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <span className="text-gray-400 text-xl">No leads found.</span>
        </div>
      )}
      {!loading && !error && filteredLeads.length > 0 && (
        <div className="flex flex-col gap-4 overflow-visible">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => handleLeadClick(lead)}
              onConvert={() => handleConvertClick(lead)}
            />
          ))}
        </div>
      )}
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
