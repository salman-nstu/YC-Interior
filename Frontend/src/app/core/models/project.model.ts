import { MediaResponse } from './media.model';

export interface ProjectResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverMediaId: number;
  categoryType: string;
  status: string;
  publishedAt: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  coverMedia: MediaResponse;
  images: MediaResponse[];
}

export interface ProjectRequest {
  title: string;
  slug?: string;
  description?: string;
  coverMediaId?: number;
  categoryType: string;
  status?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  imageMediaIds?: number[];
}
