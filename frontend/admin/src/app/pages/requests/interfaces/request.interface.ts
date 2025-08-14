export interface GetRequestInterface{
  id: string;
  sent_to: number;
  quotes: number;
  answers: number;
  name: string;
  email: string | null;
  phone: string;
  comments: string | null;
  entry_city: string;
  receive_at_airport: string;
  devolution_city: string;
  returns_at_airport: string;
  devolution_date: Date;
  entry_date: Date;
  days_of_rent: number;
  devolution_time: string;
  entry_time: string;
  gamma: string;
  transmission: string;
  created_at: Date;
}
