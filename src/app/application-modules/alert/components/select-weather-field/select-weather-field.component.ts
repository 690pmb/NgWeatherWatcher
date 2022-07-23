import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ConfigurationService} from '../../../../service/configuration.service';
import {WeatherFieldConfig} from '../../../../model/configuration';
import {WeatherField} from '../../../../model/alert/weather-field';

export type DropDownChoice = {key: WeatherField; value: WeatherFieldConfig};

@Component({
  selector: 'app-select-weather-field',
  templateUrl: './select-weather-field.component.html',
  styleUrls: ['./select-weather-field.component.scss'],
})
export class SelectWeatherFieldComponent implements OnInit {
  @Output()
  selected = new EventEmitter<WeatherFieldConfig>();

  choices: DropDownChoice[] = [];

  constructor(private config: ConfigurationService) {}

  ngOnInit() {
    const weatherFields = this.config.configuration.weatherFields;
    this.choices = Object.values(WeatherField).map(key => ({
      key,
      value: {...weatherFields[key], field: key},
    }));
  }
}
