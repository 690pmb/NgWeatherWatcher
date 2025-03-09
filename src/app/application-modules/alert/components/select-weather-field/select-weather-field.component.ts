import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {ConfigurationService} from '@services/configuration.service';
import {WeatherFieldConfig} from '@model/configuration';
import {WeatherField} from '@model/alert/weather-field';
import {TranslatePipe} from '@ngx-translate/core';
import {MatOptionModule} from '@angular/material/core';

import {MatSelectModule} from '@angular/material/select';
import {DropDownChoice} from '../../../../model/dropdown-choice';

@Component({
  selector: 'app-select-weather-field',
  templateUrl: './select-weather-field.component.html',
  styleUrls: ['./select-weather-field.component.scss'],
  standalone: true,
  imports: [MatSelectModule, MatOptionModule, TranslatePipe],
})
export class SelectWeatherFieldComponent<T extends WeatherFieldConfig>
  implements OnInit
{
  @Input()
  initialValue?: WeatherField;

  @Output()
  selected = new EventEmitter<WeatherFieldConfig>();

  choices: DropDownChoice<T>[] = [];
  initialChoice?: DropDownChoice<T>;

  constructor(private config: ConfigurationService) {}

  ngOnInit() {
    const weatherFields = this.config.configuration.weatherFields;
    this.choices = Object.values(WeatherField).map(key => ({
      key: key.toLowerCase(),
      value: {
        ...weatherFields[key],
        field: key,
      } as T,
    }));
    if (this.initialValue) {
      this.initialChoice = this.choices.find(
        c => c.key === this.initialValue?.toLowerCase(),
      );
      if (this.initialChoice) {
        this.selected.emit(this.initialChoice.value);
      }
    }
  }
}
