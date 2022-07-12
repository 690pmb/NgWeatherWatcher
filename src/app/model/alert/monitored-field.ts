import {WeatherField} from './weather-field';

export interface MonitoredField {
  field: WeatherField;
  min: number;
  max: number;
}
