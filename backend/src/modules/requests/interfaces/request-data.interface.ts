export interface RequestData {
  id: string;
  phones: string[];
  providerName: string[];
  requestToProvider: { [key: string]: string }[];
  gamma: string;
  transmission: string;
  daysOfRent: number;
  entryCity: string;
  devolutionCity: string;
  receiveAtAirport: string;
  returnsAtAirport: string;
  entryDate: string;
  devolutionDate: string;
  entryTime: string;
  devolutionTime: string;
  comments: string;
}

export interface GetRequestDataInterface{
  id: string;
  sent_to: number;
  quotes: number;
  answers: number;
  name: string;
  email: string | null;
  phone: string;
  comments: string | null;
  id_entry_city: number;
  receive_at_airport: boolean;
  id_devolution_city: number;
  returns_at_airport: boolean;
  devolution_date: Date;
  entry_date: Date;
  devolution_time: string;
  entry_time: string;
  gamma_id: string;
  transmission_id: string;
  created_at: Date;
}