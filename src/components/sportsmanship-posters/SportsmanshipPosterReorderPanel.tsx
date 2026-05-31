import { useState } from "react";
import type { SportsmanshipPoster, SportsmanshipPosterReorderItem } from "@/types/sportsmanshipPoster";
import { ArrowUp, ArrowDown, Save, X, Loader2 } from "lucide-react";

interface Props {
  posters: SportsmanshipPoster[];
  onSave: (items: SportsmanshipPosterReorderItem[]) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function SportsmanshipPosterReorderPanel({
  posters,
  onSave,
  onCancel,
  isSaving,
}: Props) {
  const [items, setItems] = useState<SportsmanshipPoster[]>(() => {
    return [...posters].sort((a, b) => a.sort_order - b.sort_order);
  });

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setItems(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setItems(newItems);
  };

  const handleSave = () => {
    const payload: SportsmanshipPosterReorderItem[] = items.map((item, index) => ({
      id: item.id,
      sort_order: index,
    }));
    onSave(payload);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
        <div>
           <h3 className="text-sm font-bold text-gray-900">Mode Urutkan Poster</h3>
           <p className="text-xs text-gray-500 mt-1">Gunakan tombol panah untuk mengubah urutan. Urutan ini menentukan posisi poster di carousel peserta.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <X size={16} /> Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-bold bg-[#b6252a] text-white hover:bg-[#961f23] transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
            Simpan Urutan
          </button>
        </div>
      </div>

      <div className="p-0">
        {items.map((poster, index) => (
          <div 
            key={poster.id} 
            className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
               <div className="h-12 w-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                 <img src={poster.image_url} alt={poster.title} className="h-full w-full object-cover" />
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-900">{poster.title}</p>
                 <p className="text-xs text-gray-500">
                    Status: <span className={poster.is_active ? "text-emerald-600 font-bold" : "text-gray-500 font-bold"}>{poster.is_active ? "Aktif" : "Nonaktif"}</span>
                 </p>
               </div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-gray-100 transition-colors"
                title="Pindah ke atas"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1}
                className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-gray-100 transition-colors"
                title="Pindah ke bawah"
              >
                <ArrowDown size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
