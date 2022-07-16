import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

type Format = 'full' | 'date' | 'hour';

@Pipe({
  name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
  transform(value: DateTime, format: Format = 'full'): string {
    let fmt: string;
    switch (format) {
      case 'full':
        fmt = 'dd/MM/yyyy HH:mm';
        break;
      case 'date':
        fmt = 'dd/MM/yyyy';
        break;
      case 'hour':
        fmt = 'HH:mm';
        break;
    }
    return value.toFormat(fmt);
  }
}
