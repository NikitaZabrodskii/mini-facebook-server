import { ILogger } from "./logger/logger.interface";
import express, { Express } from "express";
import { Server } from "http";
import { UserController } from "./users/user.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { PrismaService } from "./database/prisma.service";
import { json } from "body-parser";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.PrismaService) private prisma: PrismaService
  ) {
    this.app = express();
    this.port = 8000;
  }

  useBodyParser(): void {
    this.app.use(json());
  }

  private useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  public async init() {
    this.useBodyParser();
    this.useRoutes();
    await this.prisma.connect();
    this.server = this.app.listen(this.port);
    this.logger.log(`application started on port ${this.port}`);
  }
}
