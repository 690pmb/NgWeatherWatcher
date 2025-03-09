import {WeatherField} from './weather-field';
import {Expose} from 'class-transformer';

export const UNITS: Record<WeatherField, string> = {
  TEMP: '°C',
  CHANCE_OF_RAIN: '%',
  CHANCE_OF_SNOW: '%',
  CLOUD: '%',
  FEELS_LIKE: '°C',
  HUMIDITY: '%',
  PRECIP: 'mm',
  PRESSURE: 'hPa',
  UV: '',
  WIND: 'km/h',
};

export class MonitoredField {
  field!: WeatherField;
  min?: number;
  max?: number;

  @Expose()
  get summary(): string {
    let minMax = '';
    let suffix = '';
    if (this.min && this.max) {
      minMax = `${this.min} - ${this.max}`;
    } else if (this.min && !this.max) {
      minMax = `${this.min}`;
      suffix = 'min';
    } else if (!this.min && this.max) {
      minMax = `${this.max}`;
      suffix = 'max';
    }
    return `${minMax} ${this.unit} ${suffix}`;
  }

  @Expose()
  get unit(): string {
    return UNITS[this.field];
  }
}
