"use client";

import { useState } from "react";
import { useSportsmanshipPosters } from "@/hooks/useSportsmanshipPosters";
import type { SportsmanshipPoster, SportsmanshipPosterFormPayload } from "@/types/sportsmanshipPoster";
import SportsmanshipPosterToolbar from "./SportsmanshipPosterToolbar";
import SportsmanshipPosterGrid from "./SportsmanshipPosterGrid";
import SportsmanshipPosterFormModal from "./SportsmanshipPosterFormModal";
import SportsmanshipPosterDeleteModal from "./SportsmanshipPosterDeleteModal";
import SportsmanshipPosterPreviewModal from "./SportsmanshipPosterPreviewModal";
import SportsmanshipPosterReorderPanel from "./SportsmanshipPosterReorderPanel";

export default function SportsmanshipPosterManager() {
  const {
    posters,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLoading,
    isSaving,
    error,
    refresh,
    createPoster,
    updatePoster,
    deletePoster,
    togglePoster,
    reorderPosters,
  } = useSportsmanshipPosters();

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);

  // Selected Item States
  const [selectedPoster, setSelectedPoster] = useState<SportsmanshipPoster | null>(null);

  // Handlers for Form
  const handleOpenCreate = () => {
    setSelectedPoster(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (poster: SportsmanshipPoster) => {
    setSelectedPoster(poster);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload: SportsmanshipPosterFormPayload) => {
    if (selectedPoster) {
      await updatePoster(selectedPoster.id, payload);
    } else {
      await createPoster(payload);
    }
  };

  // Handlers for Delete
  const handleOpenDelete = (poster: SportsmanshipPoster) => {
    setSelectedPoster(poster);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPoster) {
      await deletePoster(selectedPoster.id);
    }
  };

  // Handlers for Preview
  const handleOpenPreview = (poster: SportsmanshipPoster) => {
    setSelectedPoster(poster);
    setIsPreviewOpen(true);
  };

  // Handlers for Reorder
  const handleToggleReorderMode = () => {
    setIsReorderMode(!isReorderMode);
    // Reset search & filter if entering reorder mode to see everything
    if (!isReorderMode) {
      setSearch("");
      setStatusFilter("all");
    }
  };

  const handleReorderSave = async (items: import("@/types/sportsmanshipPoster").SportsmanshipPosterReorderItem[]) => {
    await reorderPosters(items);
    setIsReorderMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Poster</p>
           <p className="text-2xl font-black text-gray-900">{posters.length}</p>
         </div>
         <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Poster Aktif</p>
           <p className="text-2xl font-black text-emerald-600">{posters.filter(p => p.is_active).length}</p>
         </div>
         <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nonaktif</p>
           <p className="text-2xl font-black text-gray-400">{posters.filter(p => !p.is_active).length}</p>
         </div>
         <div className="bg-[#b6252a] rounded-2xl p-4 shadow-sm shadow-red-200">
           <p className="text-xs font-bold text-red-200 uppercase tracking-wider mb-1">Tampil di Carousel</p>
           <p className="text-2xl font-black text-white">{posters.filter(p => p.is_active).length}</p>
         </div>
      </div>

      <SportsmanshipPosterToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onCreateNew={handleOpenCreate}
        onToggleReorderMode={handleToggleReorderMode}
        isReorderMode={isReorderMode}
        totalPosters={posters.length}
      />

      {isReorderMode ? (
        <SportsmanshipPosterReorderPanel
          posters={posters}
          onSave={handleReorderSave}
          onCancel={() => setIsReorderMode(false)}
          isSaving={isSaving}
        />
      ) : (
        <SportsmanshipPosterGrid
          posters={posters}
          isLoading={isLoading}
          error={error}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onToggle={togglePoster}
          onPreview={handleOpenPreview}
          onRetry={refresh}
          onCreateNew={handleOpenCreate}
        />
      )}

      {/* Modals */}
      <SportsmanshipPosterFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        poster={selectedPoster || undefined}
      />

      <SportsmanshipPosterDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        poster={selectedPoster}
      />

      <SportsmanshipPosterPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        poster={selectedPoster}
      />
    </div>
  );
}
