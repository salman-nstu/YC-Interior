export interface Review {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  projectTitle: string | null;
  displayOrder: number;
  createdAt: string;
}
