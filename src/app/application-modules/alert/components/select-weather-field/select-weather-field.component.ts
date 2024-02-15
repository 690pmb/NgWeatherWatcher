import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';
import {ConfigurationService} from '@services/configuration.service';
import {WeatherFieldConfig} from '@model/configuration';
import {WeatherField} from '@model/alert/weather-field';

export type DropDownChoice = {key: WeatherField; value: WeatherFieldConfig};

@Component({
  selector: 'app-select-weather-field',
  templateUrl: './select-weather-field.component.html',
  styleUrls: ['./select-weather-field.component.scss'],
})
export class SelectWeatherFieldComponent implements OnInit {
  @Input()
  initialValue?: WeatherField;

  @Output()
  selected = new EventEmitter<WeatherFieldConfig>();

  choices: DropDownChoice[] = [];
  initialChoice?: DropDownChoice;

  constructor(private config: ConfigurationService) {}

  ngOnInit() {
    const weatherFields = this.config.configuration.weatherFields;
    this.choices = Object.values(WeatherField).map(key => ({
      key,
      value: {...weatherFields[key], field: key},
    }));
    if (this.initialValue) {
      this.initialChoice = this.choices.find(c => c.key === this.initialValue);
      if (this.initialChoice) {
        this.selected.emit(this.initialChoice.value);
      }
    }
  }

  trackByFn: TrackByFunction<DropDownChoice> = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _index: number,
    item: DropDownChoice
  ) => item.key;
}
