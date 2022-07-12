import {MonitoredDays} from './monitored-days';
import {MonitoredField} from './monitored-field';

export interface Alert {
  id: number;
  triggerDays: string[];
  triggerHour: string;
  monitoredDays: MonitoredDays;
  monitoredHours: string[];
  monitoredFields: MonitoredField[];
  location: string;
  forceNotification: boolean;
}
