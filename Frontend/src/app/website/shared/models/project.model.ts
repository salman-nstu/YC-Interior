export interface Project {
  id: number;
  title: string;
  slug?: string;
  description: string;
  coverMediaId?: number;
  categoryType?: string;
  status?: string;
  publishedAt?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  coverMedia?: {
    id: number;
    url: string;
    fileName?: string;
    mimeType?: string;
    category?: string;
    subCategory?: string;
    altText?: string;
  };
  images?: Array<{
    id: number;
    url: string;
    fileName?: string;
    mimeType?: string;
    altText?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
