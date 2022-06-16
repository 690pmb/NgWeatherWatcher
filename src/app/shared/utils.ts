export class Utils {
  static isBlank<T>(str: T): boolean {
    return (
      str === undefined ||
      str === null ||
      (typeof str === 'string' && str.trim() === '')
    );
  }

  static isNotBlank(str: string): boolean {
    return !Utils.isBlank(str);
  }

  static getOrElse<T>(nullableValue: T, defaultValue: T): T {
    return Utils.isBlank(nullableValue) ? defaultValue : nullableValue;
  }
}
