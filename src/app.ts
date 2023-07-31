import express, { Express } from "express";
import { Server } from "http";
import { UserController } from "./users/user.controller";

export class App {
  app: Express;
  server: Server;
  port: number;
  userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.app = express();
    this.port = 8000;
  }

  private useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  public init() {
    this.server = this.app.listen(this.port);
    this.useRoutes();
    console.log("server started");
  }
}
