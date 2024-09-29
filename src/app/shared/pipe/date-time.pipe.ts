import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

type Format = 'beautiful' | 'date' | 'full' | 'hour';
type Result<T> = T extends DateTime[] ? string[] : string;

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

  transform<T extends DateTime | DateTime[] | string>(
    value: T,
    format: Format = 'full',
    lang?: string
  ): Result<T> {
    const toFormat = (v: DateTime): string =>
      v.toFormat(DateTimePipe.typeFormat[format], {locale: lang});
    if (Array.isArray(value)) {
      return value.map(v => toFormat(v)) as Result<T>;
    } else if (value instanceof DateTime) {
      return toFormat(value) as Result<T>;
    } else {
      return toFormat(DateTime.fromISO(value)) as Result<T>;
    }
  }
}
