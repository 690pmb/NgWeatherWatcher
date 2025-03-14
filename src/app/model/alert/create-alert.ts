import {Transform, Type} from 'class-transformer';
import {Utils} from '@shared/utils';
import {CreateMonitoredField} from './create-monitored-field';

export class CreateAlert {
  @Transform(({value}) => Utils.formatMinutes(value as number, 'hh:mm:00.000'))
  triggerHour!: number;

  @Transform(({value}) =>
    (value as number[]).map(v => Utils.formatMinutes(v, 'hh:mm:00.000')),
  )
  monitoredHours!: number[];

  @Type(() => CreateMonitoredField)
  monitoredFields!: CreateMonitoredField[];

  triggerDays!: string[];
  id?: number;
  monitoredDays!: string[];
  location!: string;
  forceNotification!: boolean;
}
