import { MonitoredField } from '../../../model/alert/monitored-field';
import { WeatherField } from '../../../model/alert/weather-field';

export class MonitoredFieldDto extends MonitoredField {
    fieldEnum: WeatherField;
}
