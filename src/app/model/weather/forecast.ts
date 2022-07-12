import {ForecastDay} from './forecast-day';
import {Location} from './location';

export interface Forecast {
  location: Location;
  forecastDay: ForecastDay[];
}
