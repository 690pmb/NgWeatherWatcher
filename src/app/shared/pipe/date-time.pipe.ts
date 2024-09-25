import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

type Format = 'beautiful' | 'date' | 'full' | 'hour';

@Pipe({
  name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
  static readonly typeFormat: {[key in Format]: string} = {
    full: 'dd/MM/yyyy HH:mm',
    date: 'dd/MM/yyyy',
    hour: 'HH:mm',
    beautiful: 'DDDD',
  };

  transform(
    value: DateTime | DateTime[] | string,
    format: Format = 'full',
    lang?: string
  ): string[] | string {
    const toFormat = (v: DateTime): string =>
      v.toFormat(DateTimePipe.typeFormat[format], {locale: lang});
    if (value instanceof DateTime) {
      return toFormat(value);
    } else if (Array.isArray(value)) {
      return value.map(v => toFormat(v));
    } else {
      return toFormat(DateTime.fromISO(value));
    }
  }
}
