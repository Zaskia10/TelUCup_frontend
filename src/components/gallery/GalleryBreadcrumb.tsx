import { GalleryFolder } from "@/types/gallery";
import { ChevronRight, Home } from "lucide-react";

interface Props {
  breadcrumbs: GalleryFolder[];
  onGoToRoot: () => void;
  onGoToFolder: (id: number) => void;
}

export function GalleryBreadcrumb({ breadcrumbs, onGoToRoot, onGoToFolder }: Props) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 overflow-x-auto whitespace-nowrap pb-2">
      <button 
        onClick={onGoToRoot}
        className="flex items-center gap-1 hover:text-[#a81d22] transition-colors font-medium"
      >
        <Home size={16} />
        Gallery Event
      </button>
      
      {breadcrumbs.map((crumb) => (
        <div key={crumb.id} className="flex items-center gap-2">
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
          <button 
            onClick={() => onGoToFolder(crumb.id)}
            className="hover:text-[#a81d22] transition-colors font-medium"
          >
            {crumb.name}
          </button>
        </div>
      ))}
    </div>
  );
}
