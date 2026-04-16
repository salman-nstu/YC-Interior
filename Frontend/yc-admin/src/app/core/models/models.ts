export interface Media {
  id: number;
  url: string;
  fileName: string;
  mimeType: string;
  category: string;
  subCategory: string;
  altText: string;
  uploadedBy: number;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  name: string;
  adminId: number;
  avatarMediaId: number;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  featuredProjects: number;
  totalServices: number;
  totalGallery: number;
  featuredGallery: number;
  totalClients: number;
  totalReviews: number;
  totalTeamMembers: number;
  totalPosts: number;
  unreadMessages: number;
}

export interface Settings {
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
  logoMedia?: Media;
  faviconMedia?: Media;
}

export interface AboutSection {
  id: number;
  title: string;
  description: string;
  mediaId: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  media?: Media;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  coverMediaId: number;
  status: 'draft' | 'published';
  publishedAt: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  coverMedia?: Media;
  images?: Media[];
}

export interface ProjectCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverMediaId: number;
  categoryId: number;
  status: 'draft' | 'published';
  publishedAt: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  coverMedia?: Media;
  category?: ProjectCategory;
  images?: Media[];
}

export interface Gallery {
  id: number;
  title: string;
  mediaId: number;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  media?: Media;
}

export interface Statistic {
  id: number;
  label: string;
  value: number;
  icon: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: number;
  name: string;
  logoMediaId: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  logoMedia?: Media;
}

export interface Review {
  id: number;
  name: string;
  designation: string;
  rating: number;
  description: string;
  mediaId: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  media?: Media;
}

export interface TeamMember {
  id: number;
  name: string;
  designation: string;
  mediaId: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  media?: Media;
}

export interface PostCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverMediaId: number;
  categoryId: number;
  status: 'draft' | 'published';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  coverMedia?: Media;
  category?: PostCategory;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
