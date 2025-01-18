import {Injectable} from '@angular/core';
import {MonitoredField} from '@model/alert/monitored-field';
import {WeatherField} from '@model/alert/weather-field';
import {Hour} from '@model/weather/hour';
import {AlertService} from '@services/alert.service';
import {BehaviorSubject} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  shareReplay,
  switchMap,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  alertId$ = new BehaviorSubject<string | undefined>(undefined);
  alert$ = this.alertId$.pipe(
    filter((id): id is string => !!id),
    distinctUntilChanged(),
    switchMap(a => this.alertService.getById(a)),
    shareReplay(1),
  );

  static readonly MAP_WEATHER_MONITORED = [
    {value: (h: Hour): number => h.tempC, weatherField: WeatherField.TEMP},
    {
      value: (h: Hour): number => h.chanceOfSnow,
      weatherField: WeatherField.CHANCE_OF_SNOW,
      i18n: 'chance_of_snow',
    },
    {
      value: (h: Hour): number => h.cloud,
      weatherField: WeatherField.CLOUD,
      i18n: 'cloud',
    },
    {value: (h: Hour): number => h.windKph, weatherField: WeatherField.WIND},
    {value: (h: Hour): number => h.precipMm, weatherField: WeatherField.PRECIP},
    {
      value: (h: Hour): number => h.pressureMb,
      weatherField: WeatherField.PRESSURE,
      i18n: 'pressure',
    },
    {
      value: (h: Hour): number => h.humidity,
      weatherField: WeatherField.HUMIDITY,
      i18n: 'humidity',
    },
    {
      value: (h: Hour): number => h.feelsLikeC,
      weatherField: WeatherField.FEELS_LIKE,
      i18n: 'feels_like',
    },
    {
      value: (h: Hour): number => h.chanceOfRain,
      weatherField: WeatherField.CHANCE_OF_RAIN,
      i18n: 'will_it_rain',
    },
    {
      value: (h: Hour): number => h.uv,
      weatherField: WeatherField.UV,
      i18n: 'uv',
    },
  ];

  constructor(private alertService: AlertService) {}

  static between(
    monitored: MonitoredField[],
    value: number,
    weatherField: WeatherField,
  ): boolean {
    const field = monitored.find(m => m.field === weatherField);
    return (
      !!field &&
      ((!!field.max && value >= field.max) ||
        (!!field.min && value <= field.min))
    );
  }
}
