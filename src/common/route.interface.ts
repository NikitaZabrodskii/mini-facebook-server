import { Request, NextFunction, Response } from "express";

export interface IControllerRoute {
  path: string;
  method: "get" | "post" | "put" | "delete";
  func: (req: Request, res: Response, next: NextFunction) => void;
}

export type ExpressReturnType = Response<any, Record<string, any>>;
