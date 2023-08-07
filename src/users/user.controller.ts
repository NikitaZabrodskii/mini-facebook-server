import { Response, Request, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { UserService } from "./user.service";
import { userRegisterDto } from "./dto/user-register.dto";
import { HTTPError } from "../http-error.class";
import { ValidateMiddleware } from "../common/validation.middleware";
import { userLoginDto } from "./dto/user-login.dto";

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.UserService) private userService: UserService
  ) {
    super(logger);
    this.bindRoutes([
      {
        path: "/login",
        method: "post",
        func: this.login,
        middleware: [new ValidateMiddleware(userLoginDto)],
      },
      {
        path: "/register",
        method: "post",
        func: this.register,
        middleware: [new ValidateMiddleware(userRegisterDto)],
      },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction): void {
    this.send(res, 200, "login");
  }

  async register(
    { body }: Request<{}, {}, userRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.userService.createUser(body);
    if (!result) {
      return next(new HTTPError(401, "ошибка авторизации", "login"));
    }
  }
}
