import {Condition} from './condition';

export class Hour {
  time: string;
  tempC: number;
  isDay: boolean;
  condition: Condition;
  windKph: number;
  windDir: string;
  pressureMb: number;
  precipMm: number;
  humidity: number;
  cloud: number;
  feelsLikeC: number;
  willItRain: number;
  chanceOfRain: number;
  willItSnow: number;
  chanceOfSnow: number;
  uv: number;
}
