const NAME = "BFDanmaku";
enum LogType {
  log,
  info,
  warn,
  error,
}
export class Log {
  private static devmode = false;
  public static devModeTriggle(status?: boolean) {
    this.devmode = status !== undefined ? status : !this.devmode;
  }
  private static _log(type: LogType, args: any[]) {
    let con;
    switch (type) {
      case LogType.info:
        con = console.info;
        break;
      case LogType.warn:
        con = console.warn;
        break;
      case LogType.error:
        con = console.error;
        break;
      default:
        con = console.log;
    }
    con(`[${NAME}]`, ...args);
  }
  public static info(...args: any[]) {
    if (!this.devmode) return;
    this._log(LogType.info, args);
  }
  public static log(...args: any[]) {
    if (!this.devmode) return;
    this._log(LogType.log, args);
  }
  public static warn(...args: any[]) {
    if (!this.devmode) return;
    this._log(LogType.warn, args);
  }
  public static error(...args: any[]) {
    this._log(LogType.error, args);
  }
}
