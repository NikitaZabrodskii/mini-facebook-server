import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { LoggerService } from "../logger/logger.service";

@injectable()
export class PrismaService {
  client: PrismaClient;
  constructor(@inject(TYPES.Logger) private logger: LoggerService) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log("[PrismaService] successfully connected to database");
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(
          "[PrismaService] error of connection to database " + e.message
        );
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
