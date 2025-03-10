import {MonitoredDay, MonitoredDays} from './monitored-days';
import {MonitoredField} from './monitored-field';
import {Type, Expose, Transform} from 'class-transformer';
import {DateTime} from 'luxon';
import {DayOfWeek} from './day-of-week';
import {Utils} from '@shared/utils';

const ALL_DAYS = {key: 'every_days', value: Object.values(DayOfWeek)};
const WORKING_DAYS = {
  key: 'all_working_days',
  value: [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
  ],
};
const WEEK_END = {
  key: 'week_end',
  value: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
};

export class Alert {
  @Transform(({value}) => Utils.formatHours(value as string), {
    toClassOnly: true,
  })
  triggerHour!: DateTime;

  @Transform(
    ({value}) =>
      (value as string[])
        .map(v => Utils.formatHours(v))
        .sort()
        .map(v => v.toFormat('HH:mm')),
    {
      toClassOnly: true,
    },
  )
  monitoredHours!: string[];

  @Type(() => MonitoredField)
  monitoredFields!: MonitoredField[];

  @Expose()
  getMonitoredDays(): string[] {
    return (Object.keys(MonitoredDay) as (keyof MonitoredDays)[])
      .filter(key => this.monitoredDays[key])
      .map(monitored => `alert.monitored_days.${monitored}`);
  }

  @Expose()
  getTriggerDays(locale: string, enableSummary = true): string[] {
    const summary = [ALL_DAYS, WORKING_DAYS, WEEK_END].find(
      days =>
        days.value.length === this.triggerDays.length &&
        days.value.every(day => this.triggerDays.includes(day)),
    )?.key;
    if (enableSummary && summary) {
      return [`alert.${summary}`];
    } else {
      return this.triggerDays
        .map(t => DateTime.fromFormat(t, 'EEEE'))
        .sort()
        .map(v => v.toFormat('EEEE', {locale}));
    }
  }

  id!: number;
  triggerDays!: DayOfWeek[];

  monitoredDays!: MonitoredDays;

  location!: string;
  forceNotification!: boolean;
}
