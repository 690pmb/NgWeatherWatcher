import {Condition} from './condition';

export type WindDirection = 'E' | 'N' | 'NE' | 'NW' | 'S' | 'SE' | 'SW' | 'W';

export type Hour = {
  time: string;
  tempC: number;
  isDay: boolean;
  condition: Condition;
  windKph: number;
  windDir: WindDirection;
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
};
