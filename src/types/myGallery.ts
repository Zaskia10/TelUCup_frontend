import { EventPhoto } from "./gallery";

export interface MyGalleryItem {
  id: number;
  status?: string;
  confidence?: number;
  event_photo_id?: number;
  event_photo?: EventPhoto;
  eventPhoto?: EventPhoto;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NormalizedMyGalleryPhoto {
  id: number;
  imageUrl: string;
  title?: string;
  uploadedAt?: string;
  folderName?: string;
  status?: string;
  confidence?: number;
  source: "my-gallery";
  raw: MyGalleryItem;
}

export interface MyGalleryParams {
  status?: string;
  folder_id?: number;
}
