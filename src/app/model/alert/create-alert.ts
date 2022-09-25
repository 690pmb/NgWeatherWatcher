import {MonitoredDays} from './monitored-days';
import {Transform, Type} from 'class-transformer';
import {Utils} from '../../shared/utils';
import {CreateMonitoredField} from './create-monitored-field';
import {DateTime} from 'luxon';

export class CreateAlert {
  @Transform(
    ({value}) =>
      `${Utils.minutesToFormat(value, 'hh:mm:00.000')}${DateTime.now().toFormat(
        'ZZ'
      )}`
  )
  triggerHour!: number;

  @Transform(({value}) =>
    (value as number[]).map(
      v =>
        `${Utils.minutesToFormat(v, 'hh:mm:00.000')}${DateTime.now().toFormat(
          'ZZ'
        )}`
    )
  )
  monitoredHours!: number[];

  @Type(() => CreateMonitoredField)
  monitoredFields!: CreateMonitoredField[];

  triggerDays!: string[];

  monitoredDays!: MonitoredDays;

  location!: string;
  forceNotification!: boolean;
}
