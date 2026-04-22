import { MediaResponse } from './media.model';

export interface GalleryResponse {
  id: number;
  title: string;
  mediaId: number;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  media: MediaResponse;
}

export interface GalleryRequest {
  title?: string;
  mediaId: number;
  isFeatured?: boolean;
  displayOrder?: number;
}
