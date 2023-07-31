import { Response, Router, Request, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";

@injectable()
export class UserController extends BaseController {
  constructor(@inject(TYPES.Logger) private logger: ILogger) {
    super();
    this.bindRoutes([
      { path: "/login", method: "post", func: this.login },
      { path: "/register", method: "post", func: this.register },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction): void {
    this.send(res, 200, "login");
  }

  register(req: Request, res: Response, next: NextFunction): void {
    this.send(res, 200, "register");
  }
}
