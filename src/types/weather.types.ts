export interface WeatherInfo {
  city: string;
  temp: number;
  weather: string;
  icon: string;
}

export type CityNameMap = {
  [key: string]: string;
} 