import { HTTPError } from "./../http-error.class";
import { Response, Request, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { UserService } from "./user.service";
import { userRegisterDto } from "./dto/user-register.dto";
import { ValidateMiddleware } from "../common/validation.middleware";
import { userLoginDto } from "./dto/user-login.dto";
import { sign } from "jsonwebtoken";
import { JWTController } from "../common/jwt.controller";

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.JWTController) private jwtController: JWTController
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

  async login(
    { body }: Request<{}, {}, userLoginDto>,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const result = await this.userService.validateUser(body);

    if (!result) {
      return this.send(res, 401, "Invalid credentials");
    }

    /// create tokens
    const accessToken = this.jwtController.signJWT(body.email, "5m");
    const refreshToken = this.jwtController.signJWT(body.email, "1y");

    res.cookie("accessToken", accessToken, {
      maxAge: 300000,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 3.154e10,
      httpOnly: true,
    });

    return this.send(
      res,
      200,
      this.jwtController.verifyJWT(accessToken).payload
    );
  }

  async register(
    { body }: Request<{}, {}, userRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    console.log("register");
    const result = await this.userService.createUser(body);
    if (!result) {
      return next(new HTTPError(401, "ошибка авторизации", "login"));
    }
    return this.ok(res, "successfully registered");
  }

  async logOut(req: Request, res: Response) {
    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    return this.send(res, 200, "logged out");
  }

  async getSessionHandler(req: Request, res: Response) {
    //@ts-ignore
    return this.send(res, 200, req.user);
  }

  async requireUser(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    if (!req.user) {
      ///
      return this.send(res, 200, "logged out");
    }

    return next();
  }
}
