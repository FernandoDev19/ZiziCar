export interface ReservationConfirmationModel{
  vehicle: string;
  transmission: string;
  model: number;
  entryCity: string;
  entryDateAndTime: string;
  days: number;
  totalOfRent: number;
  percentageOfRent: string;
  percentageInValues: number;
  agency: string;
  phones: string[];
  contact: string[];
  city: string[];
  address: string[];
  ids: string[];
}
