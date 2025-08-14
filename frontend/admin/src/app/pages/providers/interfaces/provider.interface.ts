export interface CreateProviderInterface{
  id?: string;
  name: string;
  nit: string;
  phone: string;
  email: string;
  country_id: number;
  state_id: number;
  city_id: number;
  address: string;
  cities_preferences?: number[];
  percentage_of_rent: number;
  allowed_payment_method: string;
}

export interface GetProviderInterface{
  id: string;
  name: string;
  nit: string;
  phone: string;
  email: string;
  country_id: number;
  state_id: number;
  city_id: number;
  address: string;
  cities_preferences?: string;
  percentage_of_rent: number;
  allowed_payment_method: string;
  created_at: Date;
}
