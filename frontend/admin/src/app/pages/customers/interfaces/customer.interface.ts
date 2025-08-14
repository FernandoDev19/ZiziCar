export interface GetCustomerInterface {
  id?: string;
  request_id: string;
  quote_id: string;
  identification: string;
  credit_card_holder_name: string;
  gender?: string;
  birthdate?: Date;
  email?: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  confirmed_payment?: boolean;
  created_at: Date;
  deleted_at?: Date;
}

export interface UpdateCustomerModel{
  identification: string;
  credit_card_holder_name?: string;
  gender?: string;
  birthdate?: Date;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  confirmed_payment?: boolean;
}

