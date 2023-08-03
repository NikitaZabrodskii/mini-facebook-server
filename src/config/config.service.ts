import { DotenvConfigOutput, DotenvParseOutput, config } from "dotenv";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { LoggerService } from "../logger/logger.service";

@injectable()
export class ConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(TYPES.Logger) private logger: LoggerService) {
    const result: DotenvConfigOutput = config();

    if (result.error) {
      this.logger.error("[ConfigService] can't read env");
    }

    this.config = result.parsed as DotenvParseOutput;
    this.logger.log("[ConfigService] can't read env");
  }

  get(key: string) {
    return this.config[key];
  }
}
