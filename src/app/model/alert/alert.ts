import {MonitoredDays} from './monitored-days';
import {MonitoredField} from './monitored-field';

export class Alert {
  id: number;
  triggerDays: string[];
  triggerHour: string;
  monitoredDays: MonitoredDays;
  monitoredHours: string[];
  monitoredFields: MonitoredField[];
  location: string;
  forceNotification: boolean;
}
