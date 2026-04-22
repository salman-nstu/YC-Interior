export interface Client {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  displayOrder: number;
  createdAt: string;
}
