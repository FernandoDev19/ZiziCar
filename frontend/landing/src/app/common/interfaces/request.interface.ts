export interface GetRequestDto{
  name: string;
  transmision_id: string;
  gamma_id: string;
  phone: string;
  email?: string | null;
  comments: string | null;
  id_entry_city: number;
  receive_at_airport: boolean;
  id_devolution_city: number;
  returns_at_airport: boolean;
  devolution_date: string;
  entry_date: string;
  devolution_time: string;
  entry_time: string;
}

export interface CreateRequestDto{
  name: string;
  transmision_id: string;
  gamma_id: string;
  phone: string;
  email?: string | null;
  comments: string | null;
  id_entry_city: number;
  receive_at_airport: boolean;
  id_devolution_city: number;
  returns_at_airport: boolean;
  devolution_date: string;
  entry_date: string;
  devolution_time: string;
  entry_time: string;
}
