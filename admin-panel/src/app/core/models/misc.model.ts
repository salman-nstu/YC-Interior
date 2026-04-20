import { MediaResponse } from './media.model';

// ─── Settings ─────────────────────────────────────────────────────────────────
export interface SettingsResponse {
  id: number;
  siteName: string;
  logoMediaId: number;
  faviconMediaId: number;
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  updatedAt: string;
  logoMedia: MediaResponse;
  faviconMedia: MediaResponse;
}

export interface SettingsRequest {
  siteName?: string;
  logoMediaId?: number;
  faviconMediaId?: number;
  email?: string;
  phone?: string;
  address?: string;
  mapEmbedUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export interface FaqResponse {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  createdAt: string;
}

export interface FaqRequest {
  question: string;
  answer: string;
  displayOrder?: number;
}

// ─── Client ───────────────────────────────────────────────────────────────────
export interface ClientResponse {
  id: number;
  name: string;
  logoMediaId: number;
  displayOrder: number;
  createdAt: string;
  logoMedia: MediaResponse;
}

export interface ClientRequest {
  name: string;
  logoMediaId?: number;
  displayOrder?: number;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface ReviewResponse {
  id: number;
  name: string;
  designation: string;
  rating: number;
  description: string;
  mediaId: number;
  isFeatured: boolean;
  createdAt: string;
  media: MediaResponse;
}

export interface ReviewRequest {
  name: string;
  designation?: string;
  rating: number;
  description?: string;
  mediaId?: number;
  isFeatured?: boolean;
}

// ─── Team Member ──────────────────────────────────────────────────────────────
export interface TeamMemberResponse {
  id: number;
  name: string;
  designation: string;
  mediaId: number;
  displayOrder: number;
  createdAt: string;
  media: MediaResponse;
}

export interface TeamMemberRequest {
  name: string;
  designation?: string;
  mediaId?: number;
  displayOrder?: number;
}

// ─── Post ─────────────────────────────────────────────────────────────────────
export interface PostCategory {
  id: number;
  name: string;
}

export interface PostResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverMediaId: number;
  categoryId: number;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  coverMedia: MediaResponse;
  category: PostCategory;
}

export interface PostRequest {
  title: string;
  slug?: string;
  description?: string;
  coverMediaId?: number;
  categoryId?: number;
  status?: string;
}

// ─── Contact Message ──────────────────────────────────────────────────────────
export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ─── About Section ────────────────────────────────────────────────────────────
export interface AboutSectionResponse {
  id: number;
  type: string;
  title: string;
  content: string;
  mediaId: number;
  createdAt: string;
  media: MediaResponse;
}

export interface AboutSectionRequest {
  type: string;
  title?: string;
  content?: string;
  mediaId?: number;
}

// ─── Statistic ────────────────────────────────────────────────────────────────
export interface StatisticResponse {
  id: number;
  label: string;
  value: string;
  icon: string;
  displayOrder: number;
}

export interface StatisticRequest {
  label: string;
  value: string;
  icon?: string;
  displayOrder?: number;
}
