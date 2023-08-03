import { Logger, ILogObj } from "tslog";
import "reflect-metadata";
import { injectable } from "inversify";
import { ILogger } from "./logger.interface";

@injectable()
export class LoggerService implements ILogger {
  public logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger({ name: "mini-logger" });
  }

  log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  error(...args: unknown[]): void {
    // отправка в sentry / rollbar
    this.logger.error(...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
