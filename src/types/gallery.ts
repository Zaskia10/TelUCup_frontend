export interface GalleryFolder {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  visibility: "public" | "private";
  created_by: number | null;
  created_at: string;
  updated_at: string;
  photos_count?: number;
  children_count?: number;
  parent?: GalleryFolder;
  children?: GalleryFolder[];
  breadcrumb?: GalleryFolder[];
}

export interface EventPhoto {
  id: number;
  gallery_folder_id: number | null;
  cloudinary_public_id: string;
  image_url: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
  folder?: GalleryFolder;
  uploader?: { id: number; name: string };
  photo_faces_count?: number;
}

export interface GalleryFolderPayload {
  name: string;
  parent_id?: number | null;
  description?: string | null;
  visibility?: "public" | "private";
}

export interface GalleryManagerState {
  currentFolderId: number | null;
  folders: GalleryFolder[];
  photos: EventPhoto[];
  breadcrumbs: GalleryFolder[];
  selectedPhoto: EventPhoto | null;
  selectedFolder: GalleryFolder | null;
  searchQuery: string;
  sortOrder: "Terbaru" | "Terlama" | "Nama";
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
}
