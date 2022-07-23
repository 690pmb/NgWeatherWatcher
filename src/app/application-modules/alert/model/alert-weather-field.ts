import {WeatherFieldConfig} from '../../../model/configuration';

export type AlertWeatherField = {
  field: WeatherFieldConfig;
  min?: number;
  max?: number;
};
