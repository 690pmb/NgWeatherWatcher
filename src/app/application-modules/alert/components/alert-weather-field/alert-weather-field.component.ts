import {Component, EventEmitter, ViewChild} from '@angular/core';
import {WeatherFieldConfig} from '@model/configuration';
import {MultipleData} from '../../model/multiple-data';
import {FormControl, FormsModule} from '@angular/forms';
import {AlertWeatherField} from '../../model/alert-weather-field';
import {SliderConfig} from '../../model/slider';
import {Pip} from '../../model/pip';
import {DefaultFormatter} from 'ng2-nouislider';
import {SliderComponent} from '../slider/slider.component';
import {SelectWeatherFieldComponent} from '../select-weather-field/select-weather-field.component';
import {MatCheckbox} from '@angular/material/checkbox';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-alert-weather-field',
  templateUrl: './alert-weather-field.component.html',
  styleUrls: ['./alert-weather-field.component.scss'],
  standalone: true,
  imports: [
    SelectWeatherFieldComponent,
    SliderComponent,
    MatCheckbox,
    TranslatePipe,
    FormsModule,
  ],
})
export class AlertWeatherFieldComponent
  implements MultipleData<AlertWeatherField, true>
{
  @ViewChild('slider')
  slider!: SliderComponent<true>;

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
  minEnabled = true;
  maxEnabled = true;

  configureSlider(selected: WeatherFieldConfig): void {
    this.configuration = {
      min: selected.min,
      max: selected.max,
      step: selected.step ?? 1,
      multiple: true,
      formatter: new DefaultFormatter(),
      pips: this.fieldPip,
    };
    if (this.initialValue?.field.field !== selected.field) {
      this.initialValue = undefined;
    }
    this.selectedField = selected;
    this.minEnabled = this.initialValue?.min !== null;
    this.maxEnabled = this.initialValue?.max !== null;
  }

  select(values?: (number | null)[]): void {
    if (this.selectedField) {
      this.selected.emit({
        field: this.selectedField,
        min: this.minEnabled ? (values?.[0] ?? null) : null,
        max: this.maxEnabled ? (values?.[1] ?? null) : null,
      });
    }
  }
}
