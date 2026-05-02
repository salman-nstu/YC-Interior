export interface PostCategory {
  id: number;
  name: string;
}

export interface Post {
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
  coverMedia?: {
    id: number;
    url: string;
    filePath: string;
    fileName: string;
    mimeType: string;
    category: string;
    subCategory: string;
    altText: string;
  };
  category?: PostCategory;
}
