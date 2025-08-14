export interface GetCountryInterface{
  id: number;
  name: string;
}

export interface GetStateInterface extends GetCountryInterface{
  country_id: number;
}

export interface GetCityInterface extends GetCountryInterface{
  state_id: number;
}
