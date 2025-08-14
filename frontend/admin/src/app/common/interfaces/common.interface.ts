export interface GetTransmissionModel{
  id: string;
  name: string;
  image_url: string;
  description: string;
}

export interface GetGammaModel{
  id: string;
  name: string;
  image_url: string;
  precio_promedio: string;
}

export interface GetCityModel{
  id: string;
  name: string;
}

export interface PostAnswerInterface{
  request_id: string;
  renter_id: string;
  answer_type: string;
  category?: string;
}

export interface GetAnswerInterface{
  id: string;
  request_id: string;
  renter_id: string;
  answer_type: string;
  category?: string;
  created_at: Date;
}

export interface GetRequestProviderRelation{
  id: string;
  request_id: string;
  provider_id: string;
  sent_at: Date;
}
