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

const formatDays = (
  toFormat: DayOfWeek[],
  locale: string,
  enableSummary = true,
): string[] => {
  const summary = [ALL_DAYS, WORKING_DAYS, WEEK_END].find(
    days =>
      days.value.length === toFormat.length &&
      days.value.every(day => toFormat.includes(day)),
  )?.key;
  if (enableSummary && summary) {
    return [`alert.${summary}`];
  } else {
    return toFormat
      .map(t => DateTime.fromFormat(t, 'EEEE'))
      .sort()
      .map(v => v.toFormat('EEEE', {locale}));
  }
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
  getMonitoredDays(locale: string, enableSummary = true): string[] {
    return formatDays(this.monitoredDays, locale, enableSummary);
  }

  @Expose()
  getTriggerDays(locale: string, enableSummary = true): string[] {
    return formatDays(this.triggerDays, locale, enableSummary);
  }

  id!: number;
  triggerDays!: DayOfWeek[];

  monitoredDays!: DayOfWeek[];

  location!: string;
  forceNotification!: boolean;
}
