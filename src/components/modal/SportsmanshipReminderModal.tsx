import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { ActiveSportsmanshipPoster } from "@/types/sportsmanshipPoster";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  posters: ActiveSportsmanshipPoster[];
}

export default function SportsmanshipReminderModal({
  isOpen,
  onClose,
  onContinue,
  posters,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset to first slide when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (!posters || posters.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posters.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);
  };

  const currentPoster = posters[currentIndex];
  const hasMultiple = posters.length > 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full animate-[scaleIn_0.3s_ease-out]">
        
        {/* Progress Bar (if multiple) */}
        {hasMultiple && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 z-10 flex">
            {posters.map((_, idx) => (
              <div 
                key={idx} 
                className={`flex-1 h-full transition-colors duration-300 ${idx <= currentIndex ? "bg-[#b6252a]" : "bg-transparent"}`}
              />
            ))}
          </div>
        )}

        {/* Carousel Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 relative">
          <div className="flex flex-col sm:flex-row h-full">
            
            {/* Image Section */}
            <div className="w-full sm:w-1/2 bg-black relative flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
              <img
                src={currentPoster.image_url}
                alt={currentPoster.title}
                className="w-full h-full object-contain sm:object-cover animate-[fadeIn_0.5s_ease-out]"
                key={currentPoster.id} // forces re-render/animation on change
              />
              
              {/* Carousel Controls Overlay (Mobile) */}
              {hasMultiple && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:hidden pointer-events-none">
                  <button 
                    onClick={handlePrev} 
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-transform"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={handleNext} 
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-transform"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Text Section */}
            <div className="w-full sm:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[#b6252a] text-[10px] font-black uppercase tracking-widest shadow-sm mb-4">
                  Reminder Sportifitas
                </div>
                
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-3">
                  {currentPoster.title}
                </h2>
                
                <p className="text-sm text-gray-600 leading-relaxed max-h-32 sm:max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {currentPoster.description}
                </p>
              </div>

              <div className="mt-8">
                {/* Carousel Navigation (Desktop) & Dots */}
                {hasMultiple && (
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1.5">
                      {posters.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-6 bg-[#b6252a]" : "w-2 bg-gray-200"}`}
                        />
                      ))}
                    </div>
                    
                    <div className="hidden sm:flex gap-2">
                      <button 
                        onClick={handlePrev} 
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#b6252a] transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={handleNext} 
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#b6252a] transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={onClose}
                    className="w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> Saya Mengerti
                  </button>
                  <button
                    onClick={onContinue}
                    className="w-full py-3.5 rounded-xl bg-[#b6252a] text-white font-bold hover:bg-[#961f23] transition-colors shadow-md shadow-red-200"
                  >
                    Lanjutkan ke Hasil Assessment
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
