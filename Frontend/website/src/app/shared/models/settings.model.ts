export interface ApplicationSettings {
  id: number;
  siteName: string;
  logoMediaId: number | null;
  faviconMediaId: number | null;
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string | null;
  description: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  whatsappUrl: string | null;
  youtubeUrl: string | null;
  logoMedia?: {
    id: number;
    filename: string;
    url: string;
    type: string;
  } | null;
  faviconMedia?: {
    id: number;
    filename: string;
    url: string;
    type: string;
  } | null;
}
