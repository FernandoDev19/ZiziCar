import { GetProviderInterface } from "../../../providers/interfaces/provider.interface";

export interface GetUserInterface{
  id: string;
  name: string;
  email: string;
  provider_id?: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  provider?: GetProviderInterface;
}

export interface CreateUserInterface{
  name: string;
  email: string;
  password: string;
  provider_id?: string;
  role: string;
}
