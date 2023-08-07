import { Request, NextFunction, Response } from "express";

export interface IMiddleware {
  execute: (req: Request, res: Response, next: NextFunction) => void;
}

export interface IControllerRoute {
  path: string;
  method: "get" | "post" | "put" | "delete";
  func: (req: Request, res: Response, next: NextFunction) => void;
  middleware: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
