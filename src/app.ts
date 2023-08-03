import { ILogger } from "./logger/logger.interface";
import express, { Express } from "express";
import { Server } from "http";
import { UserController } from "./users/user.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.Logger) private logger: ILogger
  ) {
    this.app = express();
    this.port = 8000;
  }

  private useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  public init() {
    this.server = this.app.listen(this.port);
    this.useRoutes();
    this.logger.log(`application started on port ${this.port}`);
  }
}
