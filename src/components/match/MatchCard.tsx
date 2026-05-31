import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';

export interface MatchTeam {
  name: string;
  score?: number | null;
  logoUrl?: string | null;
  cloudinaryId?: string | null;
}

export interface MatchCardProps {
  match: {
    id: string | number;
    sport: string;
    round: string;
    status: string;
    date: string | null;
    time: string | null;
    location?: string | null;
    teamA: MatchTeam;
    teamB: MatchTeam;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled": 
        return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Scheduled</span>;
      case "live": 
        return (
          <span className="bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            Live Now
          </span>
        );
      case "finished": 
        return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Finished</span>;
      default: 
        return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{status || 'TBD'}</span>;
    }
  };

  const renderTeamLogo = (team: MatchTeam) => {
    if (team.logoUrl) {
      return <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />;
    }
    if (team.cloudinaryId) {
      return <img src={`https://res.cloudinary.com/demo/image/upload/${team.cloudinaryId}`} alt={team.name} className="w-full h-full object-cover" />;
    }
    return <span className="text-gray-400 font-bold text-lg">{team.name?.charAt(0) || '?'}</span>;
  };

  // Helper to format date if it's an ISO string
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Link href={`/match/${match.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 relative cursor-pointer flex flex-col h-full">
        
        {/* Top Header */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{match.sport}</span>
            <span className="text-sm font-semibold text-gray-800">{match.round}</span>
          </div>
          <div>
            {getStatusBadge(match.status)}
          </div>
        </div>

        {/* Main Content (Teams & Score) */}
        <div className="p-6 flex-1 flex flex-col justify-center relative">
          {/* Subtle VS watermark background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <span className="text-8xl font-black italic">VS</span>
          </div>

          <div className="flex items-center justify-between relative z-10 gap-2">
            
            {/* Team A */}
            <div className="flex flex-col items-center flex-1 w-0">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform">
                {renderTeamLogo(match.teamA)}
              </div>
              <h3 className="text-sm font-bold text-gray-800 text-center line-clamp-2 title={match.teamA.name}">
                {match.teamA.name || 'TBD'}
              </h3>
            </div>

            {/* Score / VS Divider */}
            <div className="flex flex-col items-center justify-center px-4 shrink-0">
              {match.status?.toLowerCase() === 'scheduled' ? (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400 italic">
                  VS
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-gray-900">{match.teamA.score ?? '-'}</span>
                  <span className="text-gray-300 font-bold">:</span>
                  <span className="text-3xl font-black text-gray-900">{match.teamB.score ?? '-'}</span>
                </div>
              )}
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center flex-1 w-0">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform">
                {renderTeamLogo(match.teamB)}
              </div>
              <h3 className="text-sm font-bold text-gray-800 text-center line-clamp-2 title={match.teamB.name}">
                {match.teamB.name || 'TBD'}
              </h3>
            </div>
            
          </div>
        </div>

        {/* Bottom Footer Details */}
        <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-y-2 gap-x-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar size={14} className="text-blue-500 shrink-0" />
            <span className="text-xs font-medium truncate">{formatDate(match.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 justify-end">
            <Clock size={14} className="text-amber-500 shrink-0" />
            <span className="text-xs font-medium truncate">{match.time || 'TBD'}</span>
          </div>
          {match.location && (
            <div className="flex items-center gap-2 text-gray-500 col-span-2 mt-1">
              <MapPin size={14} className="text-emerald-500 shrink-0" />
              <span className="text-xs font-medium truncate">{match.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
