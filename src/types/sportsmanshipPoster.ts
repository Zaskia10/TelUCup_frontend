export interface SportsmanshipPoster {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  cloudinary_public_id?: string;
  is_active: boolean;
  sort_order: number;
  uploaded_by?: number | null;
  created_at: string;
  updated_at: string;
}

export interface ActiveSportsmanshipPoster {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  sort_order: number;
}

export interface SportsmanshipPosterFormPayload {
  title: string;
  description?: string;
  image?: File;
  is_active: boolean;
  sort_order: number;
}

export interface SportsmanshipPosterReorderItem {
  id: number;
  sort_order: number;
}
