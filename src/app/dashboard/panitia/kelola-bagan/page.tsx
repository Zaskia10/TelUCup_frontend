"use client";

import { Suspense } from "react";
import AdminBracketFilter from "@/components/bracket/AdminBracketFilter";
import MatchEditModal from "@/components/bracket/MatchEditPanel";
import "@/components/bracket/bracket.css";

import { useManageBracket } from "@/hooks/useManageBracket";
import AdminBracketPageHeader from "@/components/bracket/admin/AdminBracketPageHeader";
import AdminBracketInstructions from "@/components/bracket/admin/AdminBracketInstructions";
import AdminBracketEmptyState from "@/components/bracket/admin/AdminBracketEmptyState";
import AdminBracketBoard from "@/components/bracket/admin/AdminBracketBoard";
import AdminToast from "@/components/bracket/admin/AdminToast";

function KelolaBaganContent() {
  const {
    sports,
    selectedSport,
    selectedCategory,
    registrations,
    bracketData,
    isGenerating,
    editingMatch,
    openInFinishMode,
    toast,
    handleSportChange,
    handleCategoryChange,
    handleGenerate,
    handleRandomize,
    handleReset,
    handleMatchSelect,
    handleStartMatch,
    handleSaveMatch,
    handleDropTeam,
    setEditingMatch,
  } = useManageBracket();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row relative overflow-hidden">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 w-full min-h-screen">
        <AdminBracketPageHeader />

        <AdminBracketFilter
          sports={sports}
          selectedSport={selectedSport}
          onSportChange={handleSportChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          registrations={registrations}
          hasBracket={bracketData !== null}
          onGenerate={handleGenerate}
          onRandomize={handleRandomize}
          onReset={handleReset}
          isGenerating={isGenerating}
        />

        {!bracketData && selectedSport && (
          <AdminBracketInstructions
            selectedSport={selectedSport}
            selectedCategory={selectedCategory}
            registrations={registrations}
          />
        )}

        {!bracketData && !selectedSport && <AdminBracketEmptyState />}

        {bracketData && (
          <AdminBracketBoard
            bracketData={bracketData}
            editingMatchId={editingMatch?.id}
            onMatchSelect={handleMatchSelect}
            onDropTeam={handleDropTeam}
            onStartMatch={handleStartMatch}
          />
        )}
      </main>

      {editingMatch && (
        <MatchEditModal
          key={editingMatch.id}
          match={editingMatch}
          registrations={registrations}
          onClose={() => setEditingMatch(null)}
          onSave={handleSaveMatch}
          onStart={handleStartMatch}
          openInFinishMode={openInFinishMode}
        />
      )}

      <AdminToast toast={toast} />
    </div>
  );
}

export default function KelolaBaganPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm font-bold text-gray-400">
          Memuat bagan...
        </div>
      }
    >
      <KelolaBaganContent />
    </Suspense>
  );
}
