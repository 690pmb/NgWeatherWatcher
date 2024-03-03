import {ForecastDay} from './forecast-day';
import {Location} from './location';

export type Forecast = {
  location: Location;
  forecastDay: ForecastDay[];
};
