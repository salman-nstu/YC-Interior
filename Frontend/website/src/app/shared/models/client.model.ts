export interface Client {
  id: number;
  name: string;
  logoMediaId: number | null;
  logoMedia?: {
    id: number;
    url: string;
    fileName: string;
    mimeType: string;
    category: string;
  };
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
