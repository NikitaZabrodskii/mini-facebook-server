import { Response, Router, Request, NextFunction } from "express";
import { ExpressReturnType } from "../common/route.interface";
import { BaseController } from "../common/base.controller";

export class UserController extends BaseController {
  constructor() {
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
