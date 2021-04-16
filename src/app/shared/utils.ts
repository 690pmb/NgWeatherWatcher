export class Utils {
  static isBlank<T>(str: T | undefined | null): str is undefined | null {
    return (
      str === undefined ||
      str === null ||
      (typeof str === 'string' && str.trim() === '')
    );
  }

  static isNotBlank<T>(str: T | undefined | null): str is T {
    return !Utils.isBlank(str);
  }

  static getOrElse<T>(nullableValue: T | undefined | null, defaultValue: T): T {
    return Utils.isBlank(nullableValue) ? defaultValue : nullableValue;
  }

  static parseOffsetTime(offsetTime: string): Date {
    const result = new Date();
    const hourIndex = offsetTime.indexOf(':');
    const timeZoneIndex = offsetTime.indexOf('+');
    const hour = +offsetTime.slice(0, hourIndex);
    const minute = +offsetTime.slice(hourIndex + 1, timeZoneIndex);
    const timeZone = +offsetTime.slice(
      timeZoneIndex + 1,
      offsetTime.length - 3
    );
    result.setUTCHours(hour - timeZone);
    result.setMinutes(minute);
    return result;
  }

  static unique<T>(array: T[]): T[] {
    const result: T[] = [];
    array.forEach(element => {
      if (!result.includes(element)) {
        result.push(element);
      }
    });
    return result;
  }
}
