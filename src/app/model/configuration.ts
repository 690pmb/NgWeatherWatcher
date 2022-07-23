import {WeatherField} from './alert/weather-field';

export type WeatherFieldConfig = {
  field: WeatherField;
  min: number;
  max: number;
  step?: number;
};

export class Configuration {
  apiUrl!: string;
  userUrl!: string;
  weatherUrl!: string;
  alertUrl!: string;
  weatherFields!: {[key in WeatherField]: WeatherFieldConfig};
}
