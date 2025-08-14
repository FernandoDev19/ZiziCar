export interface Geolocation {
  continent_id: number;
  continent_name: string;
  countries: Country[];
}

export interface Country {
  country_id: number;
  country_name: string;
  prefix: number;
  states: State[];
}

export interface State {
  state_id: number;
  state_name: string;
  cities: City[];
}

export interface City {
  city_id: number;
  city_name: string;
}
