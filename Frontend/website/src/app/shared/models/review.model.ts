export interface Review {
  id: number;
  name: string;
  designation: string;
  rating: number;
  description: string;
  mediaId: number | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  media?: {
    id: number;
    url: string;
    fileName: string;
  };
}
