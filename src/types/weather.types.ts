export interface WeatherInfo {
  city: string;
  temp: number;
  description: string;
  icon: string;
}

export type CityNameMap = {
  [key: string]: string;
} 