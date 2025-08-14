export interface GetQuoteInterface {
  id: string;

  request_id: string;

  renter_id: string;

  phone_client: string;

  rent: number;

  overtime: number;

  home_delivery: number;

  home_collection: number;

  return_or_collection_different_city: number;

  total_value: number;

  brand: string;

  transmission_id: string;

  model: number;

  color: string;

  plate_end_in: string;

  value_to_block_on_credit_card: number;

  allowed_payment_method: string;

  available_kilometers: string;

  percentage_of_total_value: string;

  percentage_in_values: number;

  comments?: string;

  created_at: Date;
}

export interface PostQuoteInterface{
  request_id: string;

  renter_id: string;

  phone_client: string;

  rent: number;

  overtime: number;

  home_delivery: number;

  home_collection: number;

  return_or_collection_different_city: number;

  total_value: number;

  brand: string;

  transmission_id: string;

  model: number;

  color: string;

  plate_end_in: string;

  value_to_block_on_credit_card: number;

  paymentMethodForWarranty: string[];

  allowed_payment_method: string;

  available_kilometers: string;

  percentage_of_total_value: string;

  percentage_in_values: number;

  comments?: string;
}
