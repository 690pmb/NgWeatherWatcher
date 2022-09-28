import {Component, EventEmitter} from '@angular/core';
import {WeatherFieldConfig} from '../../../../model/configuration';
import {MultipleData} from '../../model/multiple-data';
import {FormControl} from '@angular/forms';
import {AlertWeatherField} from '../../model/alert-weather-field';
import {SliderConfig} from '../../model/slider-config';
import {Pip} from '../../model/pip';

@Component({
  selector: 'app-alert-weather-field',
  templateUrl: './alert-weather-field.component.html',
  styleUrls: ['./alert-weather-field.component.scss'],
})
export class AlertWeatherFieldComponent
  implements MultipleData<AlertWeatherField, SliderConfig>
{
  selectedField?: WeatherFieldConfig;
  fieldPip: Pip = {
    mode: 'count',
    density: 3,
    values: 9,
  };

  shownAddBtn = new EventEmitter<boolean>();
  shownDeleteBtn = new EventEmitter<boolean>();
  selected = new EventEmitter<AlertWeatherField>();
  ctrl!: FormControl<AlertWeatherField>;
  configuration!: SliderConfig;

  constructor() {}

  configureSlider(): void {
    this.configuration = {
      min: this.selectedField?.min ?? 0,
      max: this.selectedField?.max ?? 0,
      step: this.selectedField?.step ?? 1,
      multiple: true,
      pips: this.fieldPip,
    };
  }
}