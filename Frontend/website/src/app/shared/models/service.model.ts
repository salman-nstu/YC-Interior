export interface Service {
  id: number;
  title: string;
  description: string;
  coverMediaId: number | null;
  status: string;
  publishedAt: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  coverMedia?: {
    id: number;
    filename: string;
    url: string;
    type: string;
  };
  images?: any[];
}
