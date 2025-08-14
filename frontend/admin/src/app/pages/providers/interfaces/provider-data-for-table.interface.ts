export interface ProviderDataForTablesInterface{
  id: string;
  name: string;
  nit: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  address: string;
  cities_preferences?: string[];
  percentage_of_rent: string;
  allowed_payment_method: string;
  created_at_unformatted: Date;
  created_at: string;
}
