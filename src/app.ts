import { ILogger } from "./logger/logger.interface";
import express, { Express } from "express";
import { Server } from "http";
import { UserController } from "./users/user.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { PrismaService } from "./database/prisma.service";
import { json } from "body-parser";
import { JWTController } from "./common/jwt.controller";
import cookieParser from "cookie-parser";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.JWTController) private jwtController: JWTController,
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
    this.app.use("/auth", this.userController.router);
    this.app.get("/unprotected", (req, res) => {
      console.log(req.cookies);
      res.send("unprotected").json();
    });

    this.app.get(
      "/protected",
      this.jwtController.checkJWT.bind(this.jwtController),
      (req, res) => {
        res.send("protected").json();
      }
    );
  }

  public async init() {
    this.app.use(cookieParser());
    this.useBodyParser();
    this.useRoutes();
    await this.prisma.connect();
    this.server = this.app.listen(this.port);
    this.logger.log(`application started on port ${this.port}`);
  }
}
