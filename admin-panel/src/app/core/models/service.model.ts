import { MediaResponse } from './media.model';

export interface ServiceResponse {
  id: number;
  title: string;
  description: string;
  coverMediaId: number;
  status: string;
  publishedAt: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  coverMedia: MediaResponse;
  images: MediaResponse[];
}

export interface ServiceRequest {
  title: string;
  description?: string;
  coverMediaId?: number;
  status?: string;
  displayOrder?: number;
  isActive?: boolean;
  imageMediaIds?: number[];
}
