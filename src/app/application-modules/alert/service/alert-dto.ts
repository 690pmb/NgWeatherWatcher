import { Alert } from '../../../model/alert/alert';
import { DayOfWeek } from '../../../model/alert/day-of-week';

export class AlertDto extends Alert {
    triggerDaysEnum: DayOfWeek[];
    triggerDaysPretty?: string;
    triggerHourDate: Date;
    monitoredDaysPretty?: string;
    monitoredHoursPretty?: string;
    monitoredHoursDate: Date[];
}
