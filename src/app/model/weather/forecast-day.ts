import {Astro} from './astro';
import {Day} from './day';
import {Hour} from './hour';

export class ForecastDay {
  date: string;
  day: Day;
  astro: Astro;
  hour: Hour[];
}
