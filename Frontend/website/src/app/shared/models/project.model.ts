export interface Project {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
