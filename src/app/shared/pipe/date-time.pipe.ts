import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

type Format = 'full' | 'date' | 'hour';

@Pipe({
  name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
  static readonly typeFormat: {[key in Format]: string} = {
    full: 'dd/MM/yyyy HH:mm',
    date: 'dd/MM/yyyy',
    hour: 'HH:mm',
  };

  transform(
    value: DateTime | DateTime[],
    format: Format = 'full'
  ): string | string[] {
    const fmt = DateTimePipe.typeFormat[format];
    if (value instanceof DateTime) {
      return value.toFormat(fmt);
    } else {
      return value.map(v => v.toFormat(fmt));
    }
  }
}
