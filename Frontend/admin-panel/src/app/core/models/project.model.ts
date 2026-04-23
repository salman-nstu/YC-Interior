import { MediaResponse } from './media.model';

export interface ProjectCategory {
  id: number;
  name: string;
}

export interface ProjectResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverMediaId: number;
  categoryId: number;
  status: string;
  publishedAt: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  coverMedia: MediaResponse;
  category: ProjectCategory;
  images: MediaResponse[];
}

export interface ProjectRequest {
  title: string;
  slug?: string;
  description?: string;
  coverMediaId?: number;
  categoryId?: number;
  status?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  imageMediaIds?: number[];
}
