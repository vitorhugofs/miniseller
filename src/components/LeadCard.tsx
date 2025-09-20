import type { Lead } from '../interfaces';

export default function LeadCard({
  lead,
  onClick,
  onConvert,
}: {
  lead: Lead;
  onClick: () => void;
  onConvert: () => void;
}) {
  const isConverted = !!lead.Opportunity;
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
      {isConverted ? (
        <span className="mt-2 inline-block bg-gray-400 text-white px-3 py-3 rounded-lg cursor-not-allowed">
          Converted
        </span>
      ) : (
        <button
          className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          onClick={(e) => {
            e.stopPropagation();
            onConvert();
          }}
        >
          Convert
        </button>
      )}
    </div>
  );
}