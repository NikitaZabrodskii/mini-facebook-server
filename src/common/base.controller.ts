import { Response, Router } from "express";
import { ExpressReturnType, IControllerRoute } from "../common/route.interface";

export abstract class BaseController {
  private readonly _router: Router;

  constructor() {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  ///auto responses for frontend
  public send<T>(res: Response, code: number, message: T): ExpressReturnType {
    res.type("application/json");
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T): ExpressReturnType {
    return this.send(res, 200, message);
  }

  public createad(res: Response): ExpressReturnType {
    return res.sendStatus(201);
  }

  ///binding routes

  protected bindRoutes(routes: IControllerRoute[]) {
    for (const route of routes) {
      ///logger here
      const handler = route.func.bind(this);
      this.router[route.method](route.path, handler);
    }
  }
}
