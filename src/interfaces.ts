export interface ListingData {
  snapshot: string;
  title: string;
  images: string[];
  attributes: string[];
  summary: string;
  description: string;
  contact: string;
  price: string;
}

export interface Listing {
  url: string;
  data: ListingData | null;
}
