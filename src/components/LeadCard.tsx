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
      className={`flex items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer min-h-[96px] relative py-2`}
      onClick={onClick}
    >
      {isConverted && (
        <div className="absolute left-0 top-0 h-full w-2 bg-green-500 rounded-l-lg" />
      )}
      <div className="sm:flex-1 mr-auto flex flex-col pl-6 pr-4 py-4">
        <h2 className="text-2xl font-bold text-left text-black mb-1">{lead.name}</h2>
        <div className="flex flex-col text-left sm:flex-row sm:gap-4 text-sm text-gray-600">
          <span>{lead.email}</span>
          <span className='sm:block hidden'>|</span>
          <span>{lead.company}</span>
          <span className='sm:block hidden'>|</span>
          <span>{lead.source}</span>
        </div>
      </div>
      <div className="flex flex-col-reverse lg:flex-row justify-center lg:justify-right items-right lg:items-center gap-2 lg:gap-6 md:pr-4 pr-2">
        {!isConverted && (
          <button
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              onConvert();
            }}
          >
            Convert
          </button>
        )}
        <div className="flex flex-col items-end">
          { lead.score > 90 && <span className="text-3xl text-right font-extrabold text-green-700">{lead.score}</span>}
          { lead.score <= 90 && lead.score >= 70 && <span className="text-3xl text-right font-extrabold text-yellow-500">{lead.score}</span>}
          { lead.score < 70 && <span className="text-3xl text-right font-extrabold text-red-500">{lead.score}</span>}
          <span className="text-xs text-gray-400">Score</span>
        </div>
      </div>
    </div>
  );
}