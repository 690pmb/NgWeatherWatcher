import {Component, EventEmitter, OnInit} from '@angular/core';
import {WeatherFieldConfig} from '../../../../model/configuration';
import {MultipleData} from '../../model/multiple-data';
import {FormControl} from '@angular/forms';
import {AlertWeatherField} from '../../model/alert-weather-field';
import {SliderConfig} from '../../model/slider-config';
import {Pip} from '../../model/pip';
import {SliderType} from '../../model/slider-type';
import {filter} from 'rxjs/operators';
import {ConfigurationService} from '../../../../service/configuration.service';
import {WeatherField} from '../../../../model/alert/weather-field';

@Component({
  selector: 'app-alert-weather-field',
  templateUrl: './alert-weather-field.component.html',
  styleUrls: ['./alert-weather-field.component.scss'],
})
export class AlertWeatherFieldComponent
  implements MultipleData<AlertWeatherField, SliderConfig>, OnInit
{
  selectedField?: WeatherFieldConfig;
  fieldPip: Pip = {
    mode: 'count',
    density: 3,
    values: 9,
  };

  shownAddBtn = new EventEmitter<boolean>();
  shownDeleteBtn = new EventEmitter<boolean>();
  ctrl?: FormControl<AlertWeatherField>;
  configuration!: SliderConfig;

  form!: FormControl<SliderType>;

  constructor(private config: ConfigurationService) {}

  ngOnInit(): void {
    if (!this.ctrl) {
      this.ctrl = new FormControl<AlertWeatherField>(
        {
          field:
            this.config.configuration.weatherFields[
              Object.values(WeatherField)[0]
            ],
          min: 0,
          max: 0,
        },
        {nonNullable: true}
      );
    }
    this.form?.valueChanges
      .pipe(filter((v): v is number[] => Array.isArray(v)))
      .subscribe(v => {
        this.ctrl?.setValue({
          field: this.selectedField ?? this.ctrl?.value?.field,
          min: v[0],
          max: v[1],
        });
        this.shownAddBtn.emit(true);
      });
  }

  configureSlider(selected: WeatherFieldConfig): void {
    const initialValue = this.ctrl
      ? [this.ctrl.value.field.min, this.ctrl.value.field.max]
      : [];
    this.configuration = {
      min: selected.min,
      max: selected.max,
      initialValue,
      step: selected.step ?? 1,
      multiple: true,
      pips: this.fieldPip,
    };
    this.selectedField = selected;
    this.form = new FormControl<SliderType>(initialValue, {nonNullable: true});
  }
}
