import {Component, EventEmitter} from '@angular/core';
import {WeatherFieldConfig} from '@model/configuration';
import {MultipleData} from '../../model/multiple-data';
import {FormControl} from '@angular/forms';
import {AlertWeatherField} from '../../model/alert-weather-field';
import {SliderConfig} from '../../model/slider';
import {Pip} from '../../model/pip';
import {DefaultFormatter} from 'ng2-nouislider';
import {SliderComponent} from '../slider/slider.component';
import {NgIf} from '@angular/common';
import {SelectWeatherFieldComponent} from '../select-weather-field/select-weather-field.component';

@Component({
  selector: 'app-alert-weather-field',
  templateUrl: './alert-weather-field.component.html',
  styleUrls: ['./alert-weather-field.component.scss'],
  standalone: true,
  imports: [SelectWeatherFieldComponent, NgIf, SliderComponent],
})
export class AlertWeatherFieldComponent
  implements MultipleData<AlertWeatherField, true>
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
  configuration!: SliderConfig<true>;
  initialValue?: AlertWeatherField;

  configureSlider(selected: WeatherFieldConfig): void {
    this.configuration = {
      min: selected.min,
      max: selected.max,
      step: selected.step ?? 1,
      multiple: true,
      formatter: new DefaultFormatter(),
      pips: this.fieldPip,
    };
    this.selectedField = selected;
  }
}
