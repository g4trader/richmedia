export interface OfferData {
  id: string;
  course: string;
  headline: string;
  subtitle: string;
  discount: string;
  ctaText: string;
  colorFrom: string;
  colorTo: string;
  image?: string; // Placeholder URL
}

export interface LeadForm {
  name: string;
  email: string;
  phone: string;
}

export enum BannerState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
