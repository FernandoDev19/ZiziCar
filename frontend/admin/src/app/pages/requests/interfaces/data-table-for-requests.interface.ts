import { GetAnswerInterface } from "../../../common/interfaces/common.interface";
import { GetCustomerInterface } from "../../customers/interfaces/customer.interface";
import { GetProviderInterface } from "../../providers/interfaces/provider.interface";
import { GetQuoteInterface } from "../../quotes/interfaces/quote.interface";

export interface DataTableForRequestAdminInterface {
  id: string;
  sent_to: GetProviderInterface[];
  quotes: GetQuoteInterface[];
  answers: GetAnswerInterface[];
  customer: GetCustomerInterface[];
  name: string;
  email: string | null;
  phone: string;
  comments: string | null;
  entry_city: string;
  receive_at_airport: string;
  devolution_city: string;
  returns_at_airport: string;
  devolution_date: string;
  entry_date: string;
  entry_date_unformatted: Date;
  devolution_date_unformatted: Date;
  devolution_time: string;
  entry_time: string;
  gamma: string;
  transmission: string;
  days_of_rent?: number;
  created_at: Date;
};

export interface DataTableForRequestProviderInterface {
  id: string;
  quotes: GetQuoteInterface[];
  answers: GetAnswerInterface[];
  name: string;
  email: string | null;
  phone: string;
  comments: string | null;
  entry_city: string;
  receive_at_airport: string;
  devolution_city: string;
  returns_at_airport: string;
  devolution_date: string;
  entry_date: string;
  entry_date_unformatted: Date;
  devolution_date_unformatted: Date;
  devolution_time: string;
  entry_time: string;
  gamma: string;
  transmission: string;
  days_of_rent?: number;
  created_at: Date;
}
