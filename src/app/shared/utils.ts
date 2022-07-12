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
}
