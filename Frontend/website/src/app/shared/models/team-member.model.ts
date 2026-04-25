export interface TeamMember {
  id: number;
  name: string;
  designation: string;
  mediaId: number;
  displayOrder: number;
  createdAt: string;
  media?: {
    id: number;
    url: string;
    filePath: string;
    fileName: string;
    mimeType: string;
    category: string;
    subCategory: string;
    altText: string;
  };
}
