export interface Farmer {
  id?: string;
  crop: string;
  land_acres: number;
  has_irrigation: boolean;
  has_storage: boolean;
  mandi: string;
  district: string;
  language: string;
  created_at?: Date;
}
