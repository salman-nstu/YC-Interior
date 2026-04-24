export interface GalleryImage {
  id: number;
  title: string;
  mediaId: number;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  media?: {
    id: number;
    url: string;
    filePath: string;
    fileName: string;
    mimeType: string;
    category: string;
    subCategory: string;
    altText: string;
    width?: number;
    height?: number;
    aspectRatio?: 'landscape' | 'portrait' | 'square';
  };
  // Computed aspect ratio (fallback if backend doesn't provide)
  computedAspectRatio?: 'landscape' | 'portrait' | 'square';
}
