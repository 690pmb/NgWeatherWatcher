import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormArray,
} from '@angular/forms';
import {Duration, DateTime} from 'luxon';

export class Utils {
  static isBlank<T>(str: T | null | undefined): str is null | undefined {
    return (
      str === undefined ||
      str === null ||
      (typeof str === 'string' && str.trim() === '')
    );
  }

  static isNotBlank<T>(str: T | null | undefined): str is T {
    return !Utils.isBlank(str);
  }

  static getOrElse<T>(nullableValue: T | null | undefined, defaultValue: T): T {
    return Utils.isBlank(nullableValue) ? defaultValue : nullableValue;
  }

  static formatMinutes(minutes: number, format = 'h:mm'): string {
    return Duration.fromObject({minutes: Math.round(minutes)}).toFormat(format);
  }

  static timeToMinutes(hours: number, minutes: number): number {
    return Duration.fromObject({
      hours: hours,
      minutes: minutes,
    }).as('minutes');
  }

  static readonly formatHours = (v: string): DateTime => DateTime.fromISO(v);

  static readonly arrayValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null =>
    (control as FormArray).controls.every(c => !c.value)
      ? {required: true}
      : null;
}
